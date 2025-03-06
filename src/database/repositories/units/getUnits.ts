import { getDatabase } from "../../dbConnections.js";
import { UnitInfo } from "../../models/units/unit.js";

export const getUnits = async (): Promise<UnitInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let unitTypeQuery = `
    SELECT 
        id_unitsid AS id, 
        units_name AS name,
        id_unitstypeid as unit_type,
        units_display_order as display_order
    FROM units_table`;

  return new Promise((resolve, reject) => {
    db.all(unitTypeQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: UnitInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          unit_type: row.unit_type,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};