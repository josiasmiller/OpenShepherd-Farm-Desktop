import {canMigrateFrom, DatabaseVersion, DB_VERSION_TARGET, dbVersionFrom} from "@database/schema"

export const DB_VERSION_CHECK_RESULT_TYPE_PASSED = 'db_version_check_passed'
export const DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT = 'db_version_check_invalid_format'
export const DB_VERSION_CHECK_UNSUPPORTED_VERSION = 'db_version_check_unsupported_version'
export const DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED = 'db_version_check_patch_version_recommended'
export const DB_VERSION_CHECK_MIGRATION_OPTIONAL = 'db_version_check_migration_optional'
export const DB_VERSION_CHECK_MIGRATION_REQUIRED = 'db_version_check_migration_required'

export type DBVersionCheckResult = DBVersionCheckPassed | DBVersionCheckFailed

export interface DBVersionCheckPassed {
  type: typeof DB_VERSION_CHECK_RESULT_TYPE_PASSED
}

export type DBVersionCheckFailed =
  DBVersionCheckInvalidVersionFormat
  | DBVersionCheckUnsupportedVersion
  | DBVersionCheckPatchVersionRecommended
  | DBVersionCheckMigrationOptional
  | DBVersionCheckMigrationRequired

export interface DBVersionCheckInvalidVersionFormat {
  type: typeof DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT
}

export interface DBVersionCheckUnsupportedVersion {
  type: typeof DB_VERSION_CHECK_UNSUPPORTED_VERSION,
  dbVersion: DatabaseVersion,
  requiredVersion: DatabaseVersion
}

export interface DBVersionCheckPatchVersionRecommended {
  type: typeof DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  dbVersion: DatabaseVersion,
  recommendedVersion: DatabaseVersion
}

export interface DBVersionCheckMigrationOptional {
  type: typeof DB_VERSION_CHECK_MIGRATION_OPTIONAL,
  dbVersion: DatabaseVersion,
  targetVersion: DatabaseVersion
}

export interface DBVersionCheckMigrationRequired {
  type: typeof DB_VERSION_CHECK_MIGRATION_REQUIRED,
  dbVersion: DatabaseVersion,
  targetVersion: DatabaseVersion
}

/**
 * Checks whether or the given database version string represents a valid
 * database the application can work with properly.
 *
 * @param dbVersionString
 * @param targetVersion
 * @param hasAvailableMigrations
 * @returns A DBCheckVersionResult indicating whether the database version
 * is valid and if not provides an indicator as to why.
 */
export const checkDBVersion = (
  dbVersionString: string | null,
  targetVersion: DatabaseVersion = DB_VERSION_TARGET,
  hasAvailableMigrations: (dbVersion: DatabaseVersion) => boolean = canMigrateFrom
): DBVersionCheckResult => {
  const dbVersion = dbVersionFrom(dbVersionString)
  if (dbVersion === null) {
    return { type: DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT }
  }
  if (dbVersion.major != targetVersion.major || dbVersion.minor != targetVersion.minor) {
    return (hasAvailableMigrations(dbVersion)) ? {
      type: DB_VERSION_CHECK_MIGRATION_REQUIRED,
      dbVersion: dbVersion,
      targetVersion: targetVersion
    } : {
      type: DB_VERSION_CHECK_UNSUPPORTED_VERSION,
      dbVersion: dbVersion,
      requiredVersion: targetVersion
    }
  } else if (dbVersion.patch != targetVersion.patch) {
    return (hasAvailableMigrations(dbVersion)) ? {
      type: DB_VERSION_CHECK_MIGRATION_OPTIONAL,
      dbVersion: dbVersion,
      targetVersion: targetVersion
    } : {
      type: DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
      dbVersion: dbVersion,
      recommendedVersion: targetVersion
    }
  }
  return { type: DB_VERSION_CHECK_RESULT_TYPE_PASSED }
}

export default checkDBVersion
