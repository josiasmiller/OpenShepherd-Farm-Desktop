import { Database } from "sqlite3";
import { getDatabase } from "../../../../dbConnections.js";
import { Breed, BreedRequest } from "../../../../models/read/animal/general/breed.js";

export const getBreeds = async (queryParams: BreedRequest): Promise<Breed[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  if (queryParams.species_id != null) {
    return getBreedsById(db, queryParams.species_id);
  } else {
    return getAllBreeds(db);
  }
};

// Get breed by ID
const getBreedsById = (db: Database, id: string): Promise<Breed[]> => {
  const query = `
    SELECT 
        id_breedid AS id, 
        breed_name AS name,
        breed_display_order AS display_order,
        id_speciesid AS species_id
    FROM breed_table
    WHERE id_speciesid = ?`;

  return executeQuery(db, query, [id]);
};

// Get all breeds (default)
const getAllBreeds = (db: Database): Promise<Breed[]> => {
  const query = `
    SELECT 
        id_breedid AS id, 
        breed_name AS name,
        breed_display_order AS display_order,
        id_speciesid AS species_id
    FROM breed_table`;

  return executeQuery(db, query, []);
};

// Helper function to execute queries
const executeQuery = (db: any, query: string, params: any[]): Promise<Breed[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err: any, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        const results: Breed[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
          species_id: row.species_id,
        }));

        resolve(results);
      }
    });
  });
};
