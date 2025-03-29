import { getDatabase } from "../../../../dbConnections.js";
import { Species } from "../../../../models/read/animal/general/species.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";


export const getSpecies = async (): Promise<Result<Species[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let speciesQuery = `
    SELECT 
        id_speciesid AS id, 
        species_common_name AS common_name,
        species_generic_name AS generic_name,
        species_scientific_name AS scientific_name
    FROM species_table`;

  return new Promise((resolve) => {
    db.all(speciesQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Error executing query: ${err.message}`));
      } else {
        const results: Species[] = rows.map((row: any) => ({
          id: row.id,
          common_name: row.common_name,
          generic_name: row.generic_name,
          scientific_name: row.scientific_name,
        }));
        resolve(new Success(results));
      }
    });
  });
};