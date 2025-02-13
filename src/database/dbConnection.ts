​import { Database } from 'sqlite3';


let dbInstance: Database | null = null;


export const openDb = async (dbPath: string): Promise<Database> => {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    console.log("📌 Database connection established:", dbPath);
  }
  return dbInstance;
};

// Function to get the existing database instance
export const getDatabase = (): Database | null => {
  return dbInstance;
};