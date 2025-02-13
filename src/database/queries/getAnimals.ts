import { getDatabase } from "../dbConnection";

export const getAnimals = async () => {
    
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  const animals = db.all("SELECT * FROM animals"); // fixme
  return animals;
};