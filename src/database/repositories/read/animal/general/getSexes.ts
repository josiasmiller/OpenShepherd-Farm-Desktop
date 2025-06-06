import { getDatabase } from "../../../../dbConnections";
import { Sex } from "../../../../models/read/animal/general/sex";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";


export const getSexes = async (): Promise<Result<Sex[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let sexQuery = `
    SELECT 
        id_sexid AS id, 
        sex_name AS name,
        sex_display_order AS display_order,
        id_speciesid AS species_id
    FROM sex_table`;

  return new Promise((resolve, reject) => {
    db.all(sexQuery, [], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: Sex[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
          species_id: row.species_id,
        }));

        resolve(new Success(results));
      }
    });
  });
};