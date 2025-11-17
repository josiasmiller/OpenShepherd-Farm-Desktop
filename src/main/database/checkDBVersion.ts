import {Database} from "@database/async";

/**
 * Representation of the major, minor,
 * and patch version numbers of an
 * AnimalTrakker database.
 */
export type DatabaseVersion = {
  major: number,
  minor: number,
  patch: number,
}

export const REQUIRED_DB_VERSION_MAJOR = 6
export const REQUIRED_DB_VERSION_MINOR = 0
export const REQUIRED_DB_VERSION_PATCH = 0

/**
 * Parses a version string into a DatabaseVersion object.
 *
 * @param versionString
 * @returns A DatabaseVersion object with major, minor, and patch versions applied.  Returns
 * null if the versionString is not of the form 'major#.minor#.patch#'.
 */
export const dbVersionFrom = (versionString: string | null): DatabaseVersion | null => {
  if (versionString == null) { return null }
  const splits = versionString.split('.')
  const major = (0 < splits.length && splits[0] != null && splits[0] !== '') ? Number(splits[0]) : null
  const minor = (1 < splits.length && splits[1] != null && splits[1] !== '') ? Number(splits[1]) : null
  const patch = (2 < splits.length && splits[2] != null && splits[2] !== '') ? Number(splits[2]) : null
  //The following if handles whether major, minor, or patch are NaN by the fact that
  //relational operators always resolve to false when dealing with any NaN value.
  if (major != null && 0 <= major && minor != null && 0 <= minor && patch != null && 0 <= patch) {
    return { major: major, minor: minor, patch: patch }
  }
  return null
}

export const DB_VERSION_CHECK_RESULT_TYPE_PASSED = 'db_version_check_passed'
export const DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT = 'db_version_check_invalid_format'
export const DB_VERSION_CHECK_UNSUPPORTED_VERSION = 'db_version_check_unsupported_version'
export const DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED = 'db_version_patch_version_recommended'

export type DBVersionCheckResult = DBVersionCheckPassed | DBVersionCheckFailed

export interface DBVersionCheckPassed {
  type: typeof DB_VERSION_CHECK_RESULT_TYPE_PASSED
}

export type DBVersionCheckFailed =
  DBVersionCheckInvalidVersionFormat
  | DBVersionCheckUnsupportedVersion
  | DBVersionCheckPatchVersionRecommended

export interface DBVersionCheckInvalidVersionFormat {
  type: typeof DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT
}

export interface DBVersionCheckUnsupportedVersion {
  type: typeof DB_VERSION_CHECK_UNSUPPORTED_VERSION,
  dbVersion: DatabaseVersion
}

export interface DBVersionCheckPatchVersionRecommended {
  type: typeof DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  dbVersion: DatabaseVersion
}

/**
 * Queries the given database for its AnimalTrakker database version string.
 * @param db
 * @returns The version string if found, null if not.
 */
export const queryDBVersion = async (db: Database): Promise<string | null> => {
  const queryResult = await db.get<{ database_version: string } | undefined>(QUERY_DATABASE_VERSION)
  return queryResult?.database_version ?? null
}

/**
 * Checks whether or the given database version string represents a valid
 * database the application can work with properly.
 *
 * @param dbVersionString
 * @returns A DBCheckVersionResult indicating whether the database version
 * is valid and if not provides an indicator as to why.
 */
export const checkDBVersion = (dbVersionString: string | null): DBVersionCheckResult => {
  const dbVersion = dbVersionFrom(dbVersionString)
  if (dbVersion === null) {
    return { type: DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT }
  }
  if (dbVersion.major != REQUIRED_DB_VERSION_MAJOR || dbVersion.minor != REQUIRED_DB_VERSION_MINOR) {
    return {
      type: DB_VERSION_CHECK_UNSUPPORTED_VERSION,
      dbVersion: dbVersion
    }
  } else if (dbVersion.patch != REQUIRED_DB_VERSION_PATCH) {
    return {
      type: DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
      dbVersion: dbVersion
    }
  }
  return { type: DB_VERSION_CHECK_RESULT_TYPE_PASSED }
}

const QUERY_DATABASE_VERSION = `SELECT database_version FROM animaltrakker_metadata_table LIMIT 1`

export default checkDBVersion
