import { getDatabase } from "../dbConnection.js";

// Define the Animal interface
export interface Animal {
  name: string;
  birthDate: string;
  deathDate: string | null;
}

export const animalSearch = async (): Promise<Animal[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  const animalQuery = "SELECT animal_name, birth_date, death_date FROM animal_table limit 100";
  
  return new Promise((resolve, reject) => {
    db.all(animalQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map rows to Animal objects
        const animals = rows.map((row: any) => {
          const { animal_name, birth_date, death_date } = row;
          return {
            name: animal_name,
            birthDate: birth_date,
            deathDate: death_date || null, // Use null for missing deathDate
          } as Animal; // Ensure the object adheres to the Animal interface
        });
        resolve(animals);
      }
    });
  });
};
