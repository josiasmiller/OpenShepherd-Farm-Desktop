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
