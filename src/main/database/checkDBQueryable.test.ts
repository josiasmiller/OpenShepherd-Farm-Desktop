import {Database} from "../../packages/database";
import {
  checkDBQueryable,
  DB_QUERY_CHECK_FAILED_MISSING_REQUIRED_DATA,
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

test('checkDBQueryable returns DBQueryCheckPassed when settings, animal, and required data queries succeed', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockResolvedValueOnce({ settings_count: 5 })
  getMock.mockResolvedValueOnce({ animal_count: 10 })
  getMock.mockResolvedValueOnce({ standard_settings_exists: 1 })
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

test('checkDBQueryable return DBQueryCheckRequiredDataMissing when required data is not present', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockResolvedValueOnce({ settings_count: 5 })
  getMock.mockResolvedValueOnce({ animal_count: 42 })
  getMock.mockResolvedValueOnce({ standard_settings_exists: 0 })
  const result = await checkDBQueryable(mockDatabase as Database)
  expect(result.type).toEqual(DB_QUERY_CHECK_FAILED_MISSING_REQUIRED_DATA)
})

test('checkDBQueryable return DBQueryCheckRequiredDataMissing when required data query fails', async () => {
  const getMock = (mockDatabase.get as jest.Mock)
  getMock.mockResolvedValueOnce({ settings_count: 5 })
  getMock.mockResolvedValueOnce({ animal_count: 42 })
  getMock.mockRejectedValueOnce(new Error('TEST_REQUIRED_DATA_QUERY_FAILED'))
  const result = await checkDBQueryable(mockDatabase as Database)
  expect(result.type).toEqual(DB_QUERY_CHECK_FAILED_MISSING_REQUIRED_DATA)
})
