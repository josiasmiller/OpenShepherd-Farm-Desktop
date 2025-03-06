import { getDatabase } from "../../../../dbConnections.js";
import { BreedInfo } from "../../../../models/read/animal/general/breed.js";

export const getBreeds = async (): Promise<BreedInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let breedQuery = `
    SELECT 
        id_breedid AS id, 
        breed_name AS name,
        breed_display_order AS display_order,
        id_speciesid AS species_id
    FROM breed_table`;

  return new Promise((resolve, reject) => {
    db.all(breedQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: BreedInfo[] = rows.map((row: any) => ({
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