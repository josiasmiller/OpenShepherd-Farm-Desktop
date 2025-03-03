import { getDatabase } from "../../../dbConnections.js";
import { SpeciesInfo } from "../../../models/animal/general/species.js";

export const getSpecies = async (): Promise<SpeciesInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let speciesQuery = `
    SELECT 
        id_speciesid AS id, 
        species_common_name AS common_name,
        species_generic_name AS generic_name,
        species_scientific_name AS scientific_name
    FROM species_table`;

  return new Promise((resolve, reject) => {
    db.all(speciesQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: SpeciesInfo[] = rows.map((row: any) => ({
          id: row.id,
          common_name: row.common_name,
          generic_name: row.generic_name,
          scientific_name: row.scientific_name,
        }));

        resolve(results);
      }
    });
  });
};