import { getDatabase } from "../../dbConnections.js";
import { DeathReasonInfo } from "../../models/deaths/deathReason.js";

export const getDeathReasons = async (): Promise<DeathReasonInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let deathReasonsQuery = `
    SELECT 
        id_deathreasonid AS id, 
        death_reason AS name,
        death_reason_display_order as display_order
    FROM death_reason_table`;

  return new Promise((resolve, reject) => {
    db.all(deathReasonsQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: DeathReasonInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};