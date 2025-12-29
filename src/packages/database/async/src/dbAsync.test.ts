import {Database} from "./dbAsync";

/**
 * Holds test database for all tests in this module
 */
let _testDatabase: Database | null = null

/**
 * Accessor for the test database a convenience so
 * tests do not all have to use ! to
 * handle nullity.
 */
const testDatabase = (): Database => {
  return _testDatabase!
}

/**
 * Simple script to create a table in the test database
 */
const CREATE_TEST_TABLE = `CREATE TABLE test_table (
  column_one INTEGER PRIMARY KEY,
  column_two INTEGER NOT NULL
)`

/**
 * Some sample insertions for the test database
 */
const INSERT_TEST_TABLE_ROW_1 = `INSERT INTO test_table (column_one, column_two) VALUES (1, 2);`
const INSERT_TEST_TABLE_ROW_2 = `INSERT INTO test_table (column_one, column_two) VALUES (2, 3);`

/**
 * Before each test, open a new in memory database
 * for the test to act on.
 */
beforeEach(async () => {
  _testDatabase = await Database.open(':memory:')
})

/**
 * After each test, close the in memory database quickly
 * to avoid using too many resources as the test suite grows.
 */
afterEach(async () => {
  await _testDatabase?.close()
})

/**
 * Execute a simple SQL statement that should always succeed using Database#exec.
 */
test('Database#exec resolves successfully when SQL statement executes successfully', async () => {
  return testDatabase().exec('PRAGMA VACUUM')
})

/**
 * Execute gibberish as a SQL statement so it will purposely fail to show Database#exec rejects properly.
 */
test('Database#exec rejects with an error when SQL statement fails', async () => {
  await expect(testDatabase().exec('SOME STATEMENT THAT IS DEFINITELY NOT VALID SQL')).rejects.toThrow()
})

/**
 * Insert some simple rows into the test table and verify
 * Database#run returns objects with RunResult's footprint.
 */
test('Database#run resolves with a RunResult when SQL statement runs successfully', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
  //Insert some rows and make sure RowResults are returned properly
  await expect(database.run(INSERT_TEST_TABLE_ROW_1))
    .resolves.toEqual(expect.objectContaining({ lastID: 1, changes: 1}))
  await expect(database.run(INSERT_TEST_TABLE_ROW_2))
    .resolves.toEqual(expect.objectContaining({ lastID: 2, changes: 1}))
})

/**
 * Insert some duplicate rows into the test table and verify
 * Database#run rejects with an error on the duplicate insertion.
 */
test('Database#run rejects with an Error when SQL statement fails', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
  //Insert duplicate rows and make sure rejects with an error.
  await expect(database.run(INSERT_TEST_TABLE_ROW_1))
    .resolves.toEqual(expect.objectContaining({ lastID: 1, changes: 1}))
  await expect(database.run(INSERT_TEST_TABLE_ROW_1))
    .rejects.toThrow()
})

/**
 * Insert two rows into the test database and query for one of them
 * to show Database#get resolves when a query succeeds.
 */
test('Database#get resolves to the expected row type when a qualifying row exists', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.get(`SELECT * FROM test_table WHERE column_two = 2`))
    .resolves.toEqual(expect.objectContaining({ column_one: 1, column_two: 2}))
  await expect(database.get(`SELECT * FROM test_table WHERE column_two = 3`))
    .resolves.toEqual(expect.objectContaining({ column_one: 2, column_two: 3}))
})

/**
 * Insert two rows into the test database and query for a non-existent one
 * to show Database#get still resolves, but to undefined, when a query
 * succeeds but no rows are found.
 */
test('Database#get resolves to undefined when a qualifying row does not exist', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.get(`SELECT * FROM test_table WHERE column_two = 1`))
    .resolves.toBeUndefined()
})

/**
 * Insert two rows into the test database and query with an error
 * to show Database#get rejects when the query fails.
 */
test('Database#get rejects with an error when SQL statement fails', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.get(`SELECT * FROM test_table WHERE column_three = 1`))
    .rejects.toThrow()
})

/**
 * Insert two rows into test database and query for all of them
 * to show Database#all resolves when a query succeeds.
 */
test('Database#all resolves to the expected row type when qualifying rows exist', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.all(`SELECT * FROM test_table`))
    .resolves.toEqual([
      { column_one: 1, column_two: 2 },
      { column_one: 2, column_two: 3 },
    ])
})

/**
 * Insert two rows into test database and query for all of them
 * to show Database#all resolves to empty array when a query succeeds
 * but there are no rows.
 */
test('Database#all resolves to an empty array when no rows exist', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.all(`SELECT * FROM test_table WHERE column_two = 4`))
    .resolves.toEqual([])
})

/**
 * Insert two rows into the test database and query with an error
 * to show Database#get rejects when the query fails.
 */
test('Database#all rejects with an error when the query fails', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_1) })
    .then(_ => { return database.run(INSERT_TEST_TABLE_ROW_2) })
  await expect(database.all(`SELECT * FROM test_table WHERE column_three = 2`))
    .rejects.toThrow()
})

/**
 * Insert row into test database and delete an existing row
 * under a transaction and verify the rows presence after the
 * transaction is complete.
 */
test('Database#inTransaction completes with transaction effects intact', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
      .then(() => {
        return database.run(INSERT_TEST_TABLE_ROW_1)
      })

  await database.inTransaction(async (db: Database) => {
    await db.run(INSERT_TEST_TABLE_ROW_2)
    await db.run(`DELETE FROM test_table WHERE column_one = 1`)
  })

  await expect(database.get(`SELECT * FROM test_table WHERE column_one = 1`))
      .resolves.toBeUndefined()
  await expect(database.get(`SELECT * FROM test_table WHERE column_one = 2`))
      .resolves.toEqual(expect.objectContaining({ column_one: 2, column_two: 3}))
})

/**
 * Insert row into test database and delete an existing row
 * under transaction and then throw to verify that inserted row
 * and deleted row are rolled back after transaction fails.
 */
test('Database#inTransaction rolls back effects when failures occur in transaction\'s lifetime', async () => {
  const database = testDatabase()
  await database.exec(CREATE_TEST_TABLE)
      .then(() => {
        return database.run(INSERT_TEST_TABLE_ROW_1)
      })

  await database.inTransaction(async (db: Database) => {
    await db.run(INSERT_TEST_TABLE_ROW_2)
    await db.run(`DELETE FROM test_table WHERE column_one = 1`)
    throw new Error('Forced failure of transaction.')
  }).catch(() => { /* NO-OP so we can run assertions */ })

  await expect(database.get(`SELECT * FROM test_table WHERE column_one = 1`))
      .resolves.toEqual(expect.objectContaining({ column_one: 1, column_two: 2 }))
  await expect(database.get(`SELECT * FROM test_table WHERE column_one = 2`))
      .resolves.toBeUndefined()
})
