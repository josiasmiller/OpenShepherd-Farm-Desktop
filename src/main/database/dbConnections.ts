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

  const dbVersionString = await queryDBVersion(db)
  const versionCheckResult = await checkDBVersion(dbVersionString)

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
