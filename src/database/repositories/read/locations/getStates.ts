import { getDatabase } from "../../../dbConnections.js";
import { State } from "../../../models/read/locations/state.js";

export const getStates = async (): Promise<State[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let stateQuery = `
    SELECT 
        id_stateid AS id, 
        state_name AS name,
        state_abbrev as abbrev, 
        state_display_order as display_order,
        id_countryid as country_id
    FROM state_table`;

  return new Promise((resolve, reject) => {
    db.all(stateQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: State[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
          country_id: row.country_id,
        }));

        resolve(results);
      }
    });
  });
};