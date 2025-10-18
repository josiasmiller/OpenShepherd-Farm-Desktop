import pkg from 'sqlite3';
import log from 'electron-log';

const { Database } = pkg;

let dbInstance: InstanceType<typeof Database> | null = null;

export const openDb = async (dbPath: string): Promise<InstanceType<typeof Database>> => {
  if (dbInstance) {
    // Close old connection safely
    dbInstance.close((err?: Error | null) => {
      if (err) {
        log.error("Failed to close previous database connection:", err);
      }
    });
  }

  dbInstance = new Database(dbPath);

  dbInstance.exec("PRAGMA journal_mode=DELETE", (err?: Error | null) => {
    if (err) {
      log.error("Failed to set PRAGMA journal_mode:", err);
    }
  });

  log.info("Database connection established:", dbPath);
  return dbInstance;
};

export const isDatabaseInitialized = (): Boolean => {
  return dbInstance !== null
}

export const getDatabase = (): InstanceType<typeof Database> | null => {
  if (!dbInstance) throw new Error("Database not initialized");
  return dbInstance;
};
