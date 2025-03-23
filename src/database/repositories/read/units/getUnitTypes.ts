import { getDatabase } from "../../../dbConnections.js";
import { UnitType } from "../../../models/read/units/unitType.js";

export const getUnitTypes = async (): Promise<UnitType[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let unitTypeQuery = `
    SELECT 
        id_unitstypeid AS id, 
        unit_type_name AS name,
        unit_type_display_order as display_order
    FROM units_type_table`;

  return new Promise((resolve, reject) => {
    db.all(unitTypeQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: UnitType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};