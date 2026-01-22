import {Database} from '@database/async';
import {
  DatabaseVersion,
  DB_MIGRATION_RESULT_ERROR,
  DB_MIGRATION_RESULT_FK_VIOLATIONS,
  DB_MIGRATION_RESULT_SKIPPED,
  DB_MIGRATION_RESULT_SUCCESS,
  DB_VERSION_TARGET,
  migrate,
  queryDBVersion
} from "@database/schema";
import log from 'electron-log';
import {BrowserWindow, dialog} from "electron";
import checkDBVersion, {
  DB_VERSION_CHECK_MIGRATION_OPTIONAL,
  DB_VERSION_CHECK_MIGRATION_REQUIRED,
  DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT,
  DB_VERSION_CHECK_RESULT_TYPE_PASSED,
  DB_VERSION_CHECK_UNSUPPORTED_VERSION
} from "./checkDBVersion";
import {
  checkDBQueryable,
  DB_QUERY_CHECK_FAILED_ANIMALS,
  DB_QUERY_CHECK_FAILED_MISSING_REQUIRED_DATA,
  DB_QUERY_CHECK_FAILED_SETTINGS,
  DB_QUERY_CHECK_PASSED
} from "./checkDBQueryable";
import path from "path";

type OpenDbSuccess = {
  database: Database,
  databasePath: string,
  settingsCount: number,
  animalCount: number
}

/**
 * Opens the database at the given path and performs various integrity checks,
 * including the need for and application of migrations.
 *
 * If the database passes the basic integrity checks, it remains open,
 * otherwise the user is notified and the database is closed.
 *
 * If migrations are required or optional, the user is prompted
 * via native dialogs whether they would like to
 * proceed with migrations.
 *
 * @param dbPath
 * @param parentWindow
 * @returns The database and associated counts if it is successfully opened
 * and passes integrity checks, null otherwise.
 */
export const openDb = async (dbPath: string, parentWindow: BrowserWindow): Promise<OpenDbSuccess | null> => {

  let db: Database = await Database.open(dbPath);
  let shouldMigrateToVersion: DatabaseVersion | null = null;

  try {

    const dbVersionString = await queryDBVersion(db);
    let versionCheckResult = checkDBVersion(dbVersionString);

    switch (versionCheckResult.type) {
      case DB_VERSION_CHECK_RESULT_TYPE_PASSED:
        break;
      case DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT:
        await showInvalidVersionFormat(dbPath, parentWindow);
        await db.close().catch((err: Error) => {
          log.error(`Failed to close database following invalid version format error for ${dbPath} : ${err}`);
        });
        return null;
      case DB_VERSION_CHECK_UNSUPPORTED_VERSION:
        await showUnsupportedDatabaseVersion(
          dbPath,
          versionCheckResult.dbVersion,
          DB_VERSION_TARGET.major,
          DB_VERSION_TARGET.minor,
          parentWindow,
        );
        await db.close().catch((err: Error) => {
          log.error(`Failed to close database following unsupported version found for ${dbPath} : ${err}`);
        });
        return null;
      case DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED:
        const shouldProceed = await showPatchVersionRecommended(
          dbPath,
          versionCheckResult.dbVersion,
          DB_VERSION_TARGET.major,
          DB_VERSION_TARGET.minor,
          DB_VERSION_TARGET.patch,
          parentWindow,
        );
        if (!shouldProceed) {
          await db.close().catch((err: Error) => {
            log.error(`Failed to close database following recommended patch version warning for ${dbPath} : ${err}`);
          });
          return null;
        }
        break;
      case DB_VERSION_CHECK_MIGRATION_OPTIONAL:
        const optMigrationPromptResult = await showOptionalMigrationPrompt(
          dbPath,
          versionCheckResult.dbVersion,
          versionCheckResult.targetVersion,
          versionCheckResult.targetVersion.major,
          versionCheckResult.targetVersion.major,
          versionCheckResult.targetVersion.patch,
          parentWindow
        );
        if (optMigrationPromptResult === "cancel") {
          await db.close().catch((err: Error) => {
            log.error(`Failed to close database following cancel from optional migration prompt for ${dbPath} : ${err}`);
          });
          return null;
        }
        if (optMigrationPromptResult === 'migrate') {
          shouldMigrateToVersion = versionCheckResult.targetVersion;
        }
        break;
      case DB_VERSION_CHECK_MIGRATION_REQUIRED:
        const reqMigrationPromptResult = await showRequiredMigrationPrompt(
          dbPath,
          versionCheckResult.dbVersion,
          versionCheckResult.targetVersion,
          versionCheckResult.targetVersion.major,
          versionCheckResult.targetVersion.minor,
          parentWindow
        )
        if (reqMigrationPromptResult === "cancel") {
          await db.close().catch((err: Error) => {
            log.error(`Failed to close database following cancel from required migration prompt for ${dbPath} : ${err}`);
          });
          return null;
        }
        shouldMigrateToVersion = versionCheckResult.targetVersion;
        break;
    }
  } catch (err) {
    log.error(`Failed to check database version for ${dbPath} : ${err}`);
    await db.close().catch((err: Error) => {
      log.error(`Failed to close database following failure checking database version for ${dbPath} : ${err}`);
    });
    return null;
  }

  if (shouldMigrateToVersion) {
    const pathInfo = path.parse(dbPath)
    const backupPathReturn = await dialog.showSaveDialog(parentWindow, {
      title: `Backup Your Database`,
      buttonLabel: 'Backup',
      defaultPath: pathInfo.dir,
      properties: [
        'createDirectory',
        'showOverwriteConfirmation'
      ]
    })
    if (backupPathReturn.canceled) {
      await db.close().catch((err: Error) => {
        log.error(`Failed to close database following cancelled migration path selection for ${dbPath} : ${err}`);
      });
      return null;
    }
    try {
      await db.backupTo(backupPathReturn.filePath);
    } catch (err) {
      await showDatabaseBackupFailed(
        dbPath,
        backupPathReturn.filePath,
        parentWindow
      );
      await db.close().catch((err: Error) => {
        log.error(`Failed to close database following failed migration for ${dbPath} : ${err}`);
      });
      return null;
    }
    try {
      const migrationResult = await migrate(db)
      switch (migrationResult.type) {
        case DB_MIGRATION_RESULT_SUCCESS:
          await showMigrationSuccess(
            dbPath,
            migrationResult.oldVersion,
            migrationResult.newVersion,
            parentWindow
          )
          break;
        case DB_MIGRATION_RESULT_SKIPPED:
          await showMigrationSkipped(
            migrationResult.message,
            parentWindow
          );
          break;
        case DB_MIGRATION_RESULT_ERROR:
        case DB_MIGRATION_RESULT_FK_VIOLATIONS:
          await showMigrationError(
            migrationResult.message,
            parentWindow
          )
          await db.close().catch((err: Error) => {
            log.error(`Failed to close database following failed migration for ${dbPath} : ${err}`);
          });
          return null
      }
    } catch (err) {
      await db.close().catch((err: Error) => {
        log.error(`Failed to close database following failed migration for ${dbPath} : ${err}`);
      });
      return null;
    }
  }

  try {

    const checkQueryableResult = await checkDBQueryable(db);

    switch (checkQueryableResult.type) {
      case DB_QUERY_CHECK_PASSED:
        return {
          database: db,
          databasePath: dbPath,
          settingsCount: checkQueryableResult.settingsCount,
          animalCount: checkQueryableResult.animalCount
        };
      case DB_QUERY_CHECK_FAILED_SETTINGS:
      case DB_QUERY_CHECK_FAILED_ANIMALS:
        await showQueryableCheckFailed(dbPath, parentWindow);
        log.error(`Query check failed for type ${checkQueryableResult.type} for ${dbPath} : ${checkQueryableResult.error}`);
        break;
      case DB_QUERY_CHECK_FAILED_MISSING_REQUIRED_DATA:
        await showRequiredDataMissing(dbPath, parentWindow);
        log.error(`Query check failed for type ${checkQueryableResult.type} for ${dbPath}`);
        break;
    }
    await db.close().catch((err: Error) => {
      log.error(`Failed to close database ${dbPath} after queryable check failed : ${err}`);
    });
    return null;
  } catch (err) {
    log.error(`Failed to check if database ${dbPath} is queryable : ${err}`);
    await db.close().catch((err: Error) => {
      log.error(`Failed to close database ${dbPath} after failing to check if database ${dbPath} is queryable : ${err}`);
    })
    return null;
  }
}

async function showInvalidVersionFormat(dbPath: string, parentWindow: BrowserWindow) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: `Unable to determine the version of the specified database.\n\nThe database "${dbPath}" could be corrupted or is not an AnimalTrakker database.`,
    buttons: ['Ok']
  });
}

async function showUnsupportedDatabaseVersion(
  dbPath: string,
  dbVersion: DatabaseVersion,
  requiredMajor: number,
  requiredMinor: number,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: `The database "${dbPath}" has version ${dbVersion.major}.${dbVersion.minor}.${dbVersion.patch}.\n\nThis version of AnimalTrakker requires the database version to be ${requiredMajor}.${requiredMinor}.x.`,
    buttons: ['Ok']
  });
}

async function showPatchVersionRecommended(
  dbPath: string,
  dbVersion: DatabaseVersion,
  requiredMajor: number,
  requiredMinor: number,
  recommendedPatch: number,
  parentWindow: BrowserWindow
): Promise<boolean> {
  const messageBoxReturn = await dialog.showMessageBox(parentWindow, {
    type: 'question',
    message: `The database "${dbPath}" has version ${dbVersion.major}.${dbVersion.minor}.${dbVersion.patch}.\n\nA version of ${requiredMajor}.${requiredMinor}.${recommendedPatch} is recommended.\n\nYou may experience odd behavior if you proceed with this version.\n\nWould you like to proceed?`,
    buttons: ['No', 'Yes'],
    defaultId: 0,
    cancelId: 0
  });
  return messageBoxReturn.response === 1;
}

type RequiredMigrationPromptResult = "cancel" | "migrate"

async function showRequiredMigrationPrompt(
  dbPath: string,
  dbVersion: DatabaseVersion,
  targetVersion: DatabaseVersion,
  requiredMajor: number,
  requiredMinor: number,
  parentWindow: BrowserWindow
): Promise<RequiredMigrationPromptResult> {
  const line1 = `The database "${dbPath}" has version ${dbVersion.major}.${dbVersion.minor}.${dbVersion.patch}.`;
  const line2 = `This version of AnimalTrakker requires the database version to be ${requiredMajor}.${requiredMinor}.x.`;
  const line3 = `Would you like to migrate the database to version ${targetVersion.asVersionString()}?`
  const promptMessage = `${line1}  ${line2}\n\n${line3}`;
  const messageBoxReturn = await dialog.showMessageBox(parentWindow, {
    type: 'question',
    message: promptMessage,
    buttons: ['Cancel', 'Migrate'],
    defaultId: 0,
    cancelId: 0
  });
  switch (messageBoxReturn.response) {
    case 0: return 'cancel';
    case 1: return 'migrate';
    default: return 'cancel';
  }
}

type OptionalMigrationPromptResult = "cancel" | "proceed" | "migrate"

async function showOptionalMigrationPrompt(
  dbPath: string,
  dbVersion: DatabaseVersion,
  targetVersion: DatabaseVersion,
  requiredMajor: number,
  requiredMinor: number,
  recommendedPatch: number,
  parentWindow: BrowserWindow
): Promise<OptionalMigrationPromptResult> {
  const line1 = `The database "${dbPath}" has version ${dbVersion.major}.${dbVersion.minor}.${dbVersion.patch}.`;
  const line2 = `A version of ${requiredMajor}.${requiredMinor}.${recommendedPatch} is recommended.`;
  const line3 = `You may experience odd behavior if you proceed with this version.`;
  const line4 = `Would you like to migrate the database to version ${targetVersion.asVersionString()} or proceed with this version?`;
  const promptMessage = `${line1}  ${line2}\n\n${line3}\n\n${line4}`;
  const messageBoxReturn = await dialog.showMessageBox(parentWindow, {
    type: 'question',
    message: promptMessage,
    buttons: ['Cancel', 'Proceed', 'Migrate'],
    defaultId: 0,
    cancelId: 0
  });
  switch (messageBoxReturn.response) {
    case 0: return 'cancel';
    case 1: return 'proceed';
    case 2: return 'migrate';
    default: return 'cancel';
  }
}

async function showDatabaseBackupFailed(
  dbPath: string,
  backupDbPath: string,
  parentWindow: BrowserWindow
): Promise<void> {
  const errorMessage = `An error occurred while attempting to create a backup of "${dbPath}" saved to "${backupDbPath}".`
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: errorMessage,
    buttons: ['Ok']
  })
}

async function showMigrationSuccess(
  dbPath: string,
  oldVersion: DatabaseVersion,
  newVersion: DatabaseVersion,
  parentWindow: BrowserWindow
): Promise<void> {
  await dialog.showMessageBox(parentWindow, {
    type: 'info',
    message: `Database "${dbPath}" has been successfully migrated from version ${oldVersion.asVersionString()} to ${newVersion.asVersionString()}.`,
    buttons: ['Ok']
  });
}

async function showMigrationError(
  message: string,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: message,
    buttons: ['Ok']
  })
}

async function showMigrationSkipped(
  message: string,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'info',
    message: message,
    buttons: ['Ok']
  })
}

async function showQueryableCheckFailed(
  dbPath: string,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: `The database "${dbPath}" failed to load and is not queryable.\n\nThe database may be corrupt or in an invalid state and will be closed.`,
    buttons: ['Ok']
  });
}

async function showRequiredDataMissing(
  dbPath: string,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: `The database "${dbPath}" is missing data required for AnimalTrakker to execute.`,
    buttons: ['Ok']
  });
}
