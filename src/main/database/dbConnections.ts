import {Database} from 'packages/database';
import log from 'electron-log';
import {BrowserWindow, dialog} from "electron";
import checkDBVersion, {
  DatabaseVersion,
  DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT,
  DB_VERSION_CHECK_RESULT_TYPE_PASSED,
  DB_VERSION_CHECK_UNSUPPORTED_VERSION,
  queryDBVersion,
  REQUIRED_DB_VERSION_MAJOR,
  REQUIRED_DB_VERSION_MINOR,
  REQUIRED_DB_VERSION_PATCH
} from "./checkDBVersion";
import {
  checkDBQueryable,
  DB_QUERY_CHECK_FAILED_ANIMALS,
  DB_QUERY_CHECK_FAILED_SETTINGS,
  DB_QUERY_CHECK_PASSED
} from "./checkDBQueryable";

let dbInstance: Database | null = null

/**
 * Opens the database at the given path and performs various integrity checks.
 *
 * If the database passes the basic integrity checks, it remains open,
 * otherwise the user is notified and the database is closed.
 *
 * @param dbPath
 * @param parentWindow
 * @returns The given dbPath value if the database is successfully opened
 * and passes integrity checks, null otherwise.
 */
export const openDb = async (dbPath: string, parentWindow: BrowserWindow): Promise<string | null> => {

  let newDb: Database | null = await validateDBVersionOrClose(
    await Database.open(dbPath), dbPath, parentWindow,
  )

  if (!newDb) {
    return null
  }

  newDb = await validateDBQueryableOrClose(newDb, dbPath, parentWindow)

  if (!newDb) {
    return null
  }

  if (dbInstance) {
    // Close old connection safely
    await dbInstance.close().catch((err: Error) => {
      log.error("Failed to close previous database connection:", err)
    })
    dbInstance = null
  }

  dbInstance = newDb

  await dbInstance.exec("PRAGMA journal_mode=DELETE").catch((err: Error) => {
    log.error("Failed to set PRAGMA journal_mode:", err)
  })

  log.info("Database connection established:", dbPath)

  return dbPath
}

export const isDatabaseInitialized = (): Boolean => {
  return dbInstance !== null
}

export const getDatabase = (): Database | null => {
  if (!dbInstance) throw new Error("Database not initialized")
  return dbInstance
}

const validateDBVersionOrClose = async (
  db: Database,
  dbPath: string,
  parentWindow: BrowserWindow
): Promise<Database | null> => {

  try {

    const dbVersionString = await queryDBVersion(db)
    const versionCheckResult = checkDBVersion(dbVersionString)

    switch (versionCheckResult.type) {
      case DB_VERSION_CHECK_RESULT_TYPE_PASSED:
        return db
      case DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT:
        await showInvalidVersionFormat(dbPath, parentWindow)
        await db.close().catch((err: Error) => {
          log.error(`Failed to close database following invalid version format error for ${dbPath} : ${err}`)
        })
        return null
      case DB_VERSION_CHECK_UNSUPPORTED_VERSION:
        await showUnsupportedDatabaseVersion(
          dbPath,
          versionCheckResult.dbVersion,
          REQUIRED_DB_VERSION_MAJOR,
          REQUIRED_DB_VERSION_MINOR,
          parentWindow,
        )
        await db.close().catch((err: Error) => {
          log.error(`Failed to close database following unsupported version found for ${dbPath} : ${err}`)
        })
        return null
      case DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED:
        const shouldProceed = await showPatchVersionRecommended(
          dbPath,
          versionCheckResult.dbVersion,
          REQUIRED_DB_VERSION_MAJOR,
          REQUIRED_DB_VERSION_MINOR,
          REQUIRED_DB_VERSION_PATCH,
          parentWindow,
        )
        if (!shouldProceed) {
          await db.close().catch((err: Error) => {
            log.error(`Failed to close database following recommended patch version warning for ${dbPath} : ${err}`)
          })
          return null
        } else {
          return db
        }
    }
  } catch (err) {
    log.error(`Failed to query database version for ${dbPath} : ${err}`)
    await db.close().catch((err: Error) => {
      log.error(`Failed to close database following failure querying database version for ${dbPath} : ${err}`)
    })
    return null
  }
}

async function validateDBQueryableOrClose(db: Database, dbPath: string, parentWindow: BrowserWindow): Promise<Database | null> {
  try {
    const checkQueryableResult = await checkDBQueryable(db)
    switch (checkQueryableResult.type) {
      case DB_QUERY_CHECK_PASSED:
        await showQueryableCheckPassed(
          dbPath,
          checkQueryableResult.settingsCount,
          checkQueryableResult.animalCount,
          parentWindow
        )
        return db
      case DB_QUERY_CHECK_FAILED_SETTINGS:
      case DB_QUERY_CHECK_FAILED_ANIMALS:
        await showQueryableCheckFailed(dbPath, parentWindow)
        log.error(`Query check failed for type ${checkQueryableResult.type} for ${dbPath} : ${checkQueryableResult.error}`)
        await db.close().catch((err: Error) => {
          log.error(`Failed to close database ${dbPath} after queryable check failed : ${err}`)
        })
        return null
    }
  } catch (err) {
    log.error(`Failed to check if database ${dbPath} is queryable : ${err}`)
    await db.close().catch((err: Error) => {
      log.error(`Failed to close database ${dbPath} after failing to check if database ${dbPath} is queryable : ${err}`)
    })
    return null
  }
}

async function showInvalidVersionFormat(dbPath: string, parentWindow: BrowserWindow) {
  await dialog.showMessageBox(parentWindow, {
    type: 'error',
    message: `Unable to determine the version of the specified database.\n\nThe database "${dbPath}" could be corrupted or is not an AnimalTrakker database.`,
    buttons: ['Ok']
  })
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
  })
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
  })
  return messageBoxReturn.response === 1
}

async function showQueryableCheckPassed(
  dbPath: string,
  settingsCount: number,
  animalCount: number,
  parentWindow: BrowserWindow
) {
  await dialog.showMessageBox(parentWindow, {
    type: 'info',
    message: `The database "${dbPath}" has loaded successfully.\n\nThe database currently contains ${settingsCount} default settings entries and ${animalCount} animal entries.`,
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
  })
}
