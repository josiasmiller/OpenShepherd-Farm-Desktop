import { getDatabase } from "../../../dbConnections.js";
import { SexInfo } from "../../../models/animal/general/sex.js";

export const getSexes = async (): Promise<SexInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
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
        reject(err);
      } else {
        const results: SexInfo[] = rows.map((row: any) => ({
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