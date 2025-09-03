import pkg from 'sqlite3';
import log from 'electron-log';

const { Database } = pkg;

let dbInstance: InstanceType<typeof Database> | null = null;

export const openDb = async (dbPath: string): Promise<InstanceType<typeof Database>> => {
  if (dbInstance) {
    await new Promise<void>((resolve) => {
      dbInstance!.close((err?: Error | null) => {
        if (err) {
          log.error("Failed to close previous database connection:", err);
        }
        resolve();
      });
    });
  }

  dbInstance = new Database(dbPath);

  await new Promise<void>((resolve, reject) => {
    dbInstance!.exec("PRAGMA journal_mode=DELETE", (err?: Error | null) => {
      if (err) {
        log.error("Failed to set PRAGMA journal_mode:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });

  log.info("Database connection established:", dbPath);
  return dbInstance;
};


export const getDatabase = (): InstanceType<typeof Database> | null => {
  return dbInstance;
};
