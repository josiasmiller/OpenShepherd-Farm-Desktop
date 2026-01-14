import {DatabaseVersion, dbVersionFrom} from "@database/schema"

export const REQUIRED_DB_VERSION_MAJOR = 6
export const REQUIRED_DB_VERSION_MINOR = 1
export const REQUIRED_DB_VERSION_PATCH = 0

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

export default checkDBVersion
