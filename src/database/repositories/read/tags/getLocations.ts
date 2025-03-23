import { getDatabase } from "../../../dbConnections.js";
import { Location } from "../../../models/read/tags/location.js";

export const getLocations = async (): Promise<Location[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let colorQuery = `
    SELECT 
        id_idlocationid AS id, 
        id_location_name AS name,
        id_location_abbrev as abbrev,
        id_location_display_order as display_order
    FROM id_location_table`;

  return new Promise((resolve, reject) => {
    db.all(colorQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: Location[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};