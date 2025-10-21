import {Database as Sqlite3Database, Statement, OPEN_READWRITE, OPEN_FULLMUTEX} from 'sqlite3';
import {type RunResult} from 'sqlite3'

/**
 * A wrapper class around a sqlite3 database.
 *
 * This class provides Promise based APIs for
 * sqlite3 Database's asynchronous methods
 * that model asynchrony with callbacks
 * rather than Promises.
 */
export class Database {

  /**
   * Factory method to open a Database
   *
   * This method is essentially a wrapper around the sqlite3 Database constructor
   * that presents a Promise based API.
   *
   * @param filename
   * @returns A Promise that resolves to an open Database or an error.
   */
  static open(filename: string): Promise<Database> {
    return new Promise((resolve, reject) => {
      const sqlite3Database = new Sqlite3Database(filename, OPEN_READWRITE | OPEN_FULLMUTEX, (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve(new Database(sqlite3Database))
        }
      })
    })
  }

  /**
   * Keeping the constructor private so that opening/creating a Database
   * can be done through Promises via the static open factory type method.
   *
   * @param sqliteDatabase
   * @private
   */
  private constructor(private sqliteDatabase: Sqlite3Database) {}

  /**
   * @deprecated
   * This method will be removed when use of the raw sqlite3 Database and its
   * callback interface are replaced with the promise based API exposed in this class.
   *
   * DO NOT USE THIS METHOD IN NEW CODE. IT EXISTS SOLELY TO SUPPORT LEGACY CODE UNTIL
   * THE PROMISE API IS ADOPTED.
   */
  raw(): Sqlite3Database {
    return this.sqliteDatabase
  }

  /**
   * Promise wrapper around sqlite3's Database#exec method.
   *
   * @param sql
   * @returns A Promise that resolves as completed or rejects with an error.
   */
  exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sqliteDatabase.exec(sql, (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Promise wrapper around sqlite3's Database#run method.
   *
   * @param sql
   * @param params
   * @returns A Promise that resolves to a RunResult or rejects with an error.
   */
  run(sql: string, params?: any): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.sqliteDatabase.run(sql, params ?? [], function(this: RunResult, err: Error | null) {
        if (err) {
          reject(err)
        } else {
          resolve(this)
        }
      })
    })
  }

  /**
   * Promise wrapper around sqlite3's Database#get method.
   *
   * @param sql
   * @param params
   * @returns A Promise resolving to a single row of type T or rejecting with an error.
   */
  get<T>(sql: string, params?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.sqliteDatabase.get(sql, params ?? [], function(this: Statement, err: Error | null, row: T) {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  /**
   * Promise wrapper around sqlite3 Database#all method.
   *
   * @param sql
   * @param params
   * @return Promise resolving with result entities or rejecting with an error.
   */
  all<T>(sql: string, params?: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.sqliteDatabase.all(sql, params ?? [], function(this: Statement, err: Error | null, rows: T[]){
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  /**
   * Promise wrapper around sqlite3's Database#close method.
   *
   * @returns A Promise that resolves as completed or rejects with an error.
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sqliteDatabase.close((err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
