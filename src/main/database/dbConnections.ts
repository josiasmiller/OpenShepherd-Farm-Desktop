import { Database } from 'sqlite3';
import log from 'electron-log';
import {BehaviorSubject, Observable} from "rxjs";

export type DatabaseSession = {
  database: Database,
  path: string
}

//TODO: Remove dbInstance and manage solely with databaseSubject.
let dbInstance: Database | null = null;

const dbSessionSubject = new BehaviorSubject<DatabaseSession | null>(null);

export const databaseSession$: Observable<DatabaseSession | null> = dbSessionSubject.asObservable();

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
  dbSessionSubject.next({ database: dbInstance, path: dbPath })
  return dbInstance;
};

export const closeDb = async () => {
  if (dbInstance) {
    // Close old connection safely
    dbInstance.close((err?: Error | null) => {
      if (err) {
        log.error("Failed to close database connection:", err);
      }
    });
    dbInstance = null
    dbSessionSubject.next(null)
  }
}

export const getDatabase = (): Database | null => {
  return dbInstance;
};

export const getDatabaseSession: () => DatabaseSession | null = () => {
  return dbSessionSubject.value
}

