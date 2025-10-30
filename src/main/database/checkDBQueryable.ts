import {Database} from "packages/database";

export const DB_QUERY_CHECK_PASSED = 'db_query_check_passed'
export const DB_QUERY_CHECK_FAILED_SETTINGS = 'db_query_check_failed_settings'
export const DB_QUERY_CHECK_FAILED_ANIMALS = 'db_query_check_failed_animals'

export type DBQueryCheckResult = DBQueryCheckPassed | DBQueryCheckFailed
export type DBQueryCheckFailed = DBQueryCheckFailedSettings | DBQueryCheckFailedAnimals

export type DBQueryCheckPassed = {
  type: typeof DB_QUERY_CHECK_PASSED,
  settingsCount: number,
  animalCount: number
}

export type DBQueryCheckFailedSettings = {
  type: typeof DB_QUERY_CHECK_FAILED_SETTINGS,
  error: Error
}

export type DBQueryCheckFailedAnimals = {
  type: typeof DB_QUERY_CHECK_FAILED_ANIMALS
  error: Error
}

/**
 * Performs basic queries to count default settings and animals
 * as a sort of smoke test around being able to query the database.
 *
 * @param db
 * @returns A Promise resolving to DBQueryCheckPassed if both queries return successfully,
 * and a DBQueryCheckFailed if not.  This Promise should not reject, but rejection
 * should be handled regardless.
 */
export const checkDBQueryable = async (db: Database): Promise<DBQueryCheckResult> => {
  const settingsCountResult = await db.get<{ settings_count: number }>(QUERY_COUNT_ALL_DEFAULT_SETTINGS)
    .then((result): DBQueryCheckPassed => {
      return { type: DB_QUERY_CHECK_PASSED, settingsCount: result.settings_count, animalCount: 0 }
    })
    .catch((err): DBQueryCheckFailed => {
      return { type: DB_QUERY_CHECK_FAILED_SETTINGS, error: err }
    })

  if (settingsCountResult.type !== DB_QUERY_CHECK_PASSED) {
    return settingsCountResult
  }

  const animalsCountResult = await db.get<{ animal_count: number }>(QUERY_COUNT_ALL_ANIMALS)
    .then((result): DBQueryCheckPassed => {
      return { type: DB_QUERY_CHECK_PASSED, settingsCount: 0, animalCount: result.animal_count }
    })
    .catch((err): DBQueryCheckFailed => {
      return { type: DB_QUERY_CHECK_FAILED_ANIMALS, error: err }
    })

  if (animalsCountResult.type !== DB_QUERY_CHECK_PASSED) {
    return animalsCountResult
  }

  return {
    type: DB_QUERY_CHECK_PASSED,
    settingsCount: settingsCountResult.settingsCount,
    animalCount: animalsCountResult.animalCount
  }
}

const QUERY_COUNT_ALL_DEFAULT_SETTINGS = 'SELECT COUNT(*) AS settings_count FROM animaltrakker_default_settings_table'
const QUERY_COUNT_ALL_ANIMALS = 'SELECT COUNT(*) AS animal_count FROM animal_table'
