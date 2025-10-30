import {Database} from "../../packages/database";
import {
  checkDBQueryable,
  DB_QUERY_CHECK_FAILED_ANIMALS,
  DB_QUERY_CHECK_FAILED_SETTINGS,
  DB_QUERY_CHECK_PASSED,
  DBQueryCheckFailedSettings,
  DBQueryCheckPassed
} from "./checkDBQueryable";

let mockDatabase: Partial<Database>

beforeEach(() => {
  mockDatabase = {
    get: jest.fn(),
  }
})

test('checkDBQueryable returns DBQueryCheckPassed when settings and animal queries succeed', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockResolvedValueOnce({ settings_count: 5 })
  getMock.mockResolvedValueOnce({ animal_count: 10 })
  const result = await checkDBQueryable(mockDatabase as Database)
  expect(result.type).toEqual(DB_QUERY_CHECK_PASSED)
  expect((result as DBQueryCheckPassed).settingsCount).toEqual(5)
  expect((result as DBQueryCheckPassed).animalCount).toEqual(10)
})

test('checkDBQueryable returns DBQueryCheckFailedSettings when settings query fails', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockRejectedValueOnce(new Error('TEST_SETTINGS_QUERY_FAILED'))
  const result = await checkDBQueryable(mockDatabase as Database)
  expect(result.type).toEqual(DB_QUERY_CHECK_FAILED_SETTINGS)
  expect((result as DBQueryCheckFailedSettings).error.message).toEqual('TEST_SETTINGS_QUERY_FAILED')
})

test('checkDBQueryable return DBQueryCheckFailedAnimals when animals query fails', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockResolvedValueOnce({ settings_count: 5 })
  getMock.mockRejectedValueOnce(new Error('TEST_ANIMAL_QUERY_FAILED'))
  const result = await checkDBQueryable(mockDatabase as Database)
  expect(result.type).toEqual(DB_QUERY_CHECK_FAILED_ANIMALS)
  expect((result as DBQueryCheckFailedSettings).error.message).toEqual('TEST_ANIMAL_QUERY_FAILED')
})
