import {Database} from 'packages/database';
import log from 'electron-log';

let dbInstance: Database | null = null;

export const openDb = async (dbPath: string): Promise<Database> => {
  if (dbInstance) {
    // Close old connection safely
    await dbInstance.close().catch((err: Error) => {
      log.error("Failed to close previous database connection:", err)
    })
    dbInstance = null
  }

  dbInstance = await Database.open(dbPath)

  await dbInstance.exec("PRAGMA journal_mode=DELETE").catch((err: Error) => {
    log.error("Failed to set PRAGMA journal_mode:", err)
  })

  log.info("Database connection established:", dbPath)
  return dbInstance
};

export const isDatabaseInitialized = (): Boolean => {
  return dbInstance !== null
}

export const getDatabase = (): Database | null => {
  if (!dbInstance) throw new Error("Database not initialized")
  return dbInstance
};
