import { getDatabase } from "../../../dbConnections.js";
import { County } from "../../../models/read/locations/county.js";

export const getCounties = async (): Promise<County[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let countyQuery = `
    SELECT 
        id_countyid AS id, 
        county_name AS name,
        id_stateid as state_id 
    FROM county_table`;

  return new Promise((resolve, reject) => {
    db.all(countyQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: County[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          state_id: row.state_id,
        }));

        resolve(results);
      }
    });
  });
};