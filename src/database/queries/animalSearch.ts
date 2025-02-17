import { getDatabase } from "../dbConnection.js";

export interface AnimalSearchResults {
  flock_prefix: string | null,
  name: string;
  birthDate: string | null;
  deathDate: string | null;
}

export interface AnimalSearchQueryParameters {
  name?: string | null;
  status?: string | null;         // Status could be a dropdown field
  registrationType?: string | null;  // Registration Type
  registrationNumber?: string | null;
  birthStartDate?: string | null;   // Start date for birth range
  birthEndDate?: string | null;     // End date for birth range
  deathStartDate?: string | null;   // Start date for death range
  deathEndDate?: string | null;     // End date for death range
}

export const animalSearch = async (queryParams: AnimalSearchQueryParameters = {}): Promise<AnimalSearchResults[]> => {
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
          } as AnimalSearchResults; // Ensure the object adheres to the Animal interface
        });
        resolve(animals);
      }
    });
  });
};
