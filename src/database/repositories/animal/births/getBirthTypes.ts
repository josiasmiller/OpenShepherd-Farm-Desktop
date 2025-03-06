import { getDatabase } from "../../../dbConnections.js";
import { BirthTypeInfo } from "../../../models/animal/births/birthType.js";

export const getBirthTypes = async (): Promise<BirthTypeInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let birthTypeQuery = `
    SELECT 
        id_birthtypeid AS id, 
        birth_type AS name,
        birth_type_abbrev as abbrev, 
        birth_type_display_order as display_order
    FROM birth_type_table`;

  return new Promise((resolve, reject) => {
    db.all(birthTypeQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: BirthTypeInfo[] = rows.map((row: any) => ({
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