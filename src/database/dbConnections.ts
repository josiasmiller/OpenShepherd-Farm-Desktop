import { dialog } from "electron";
import pkg from 'sqlite3';

// Destructure the Database class as a value
const { Database } = pkg;

// Declare the type as `typeof Database`
let dbInstance: InstanceType<typeof Database> | null = null;

export const openDb = async (dbPath: string): Promise<InstanceType<typeof Database>> => {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    console.log("Database connection established:", dbPath);
  } 
  return dbInstance;
};

// Function to get the existing database instance
export const getDatabase = (): InstanceType<typeof Database> | null => {
  return dbInstance;
};

export const selectNewDb = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
  });

  if (filePaths.length > 0) {
    const databasePath = filePaths[0]; // Save the selected file path

    openDb(databasePath); // Open the database in dbConnection

    return databasePath;
  }

  return null; // No file selected
};
