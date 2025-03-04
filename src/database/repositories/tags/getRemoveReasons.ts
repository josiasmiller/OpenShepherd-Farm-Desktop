import { getDatabase } from "../../dbConnections.js";
import { RemoveReasonInfo } from "../../models/tags/removeReason.js";

export const getRemoveReasons = async (): Promise<RemoveReasonInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let colorQuery = `
    SELECT 
        id_idremovereasonid AS id, 
        id_remove_reason AS name,
        id_remove_reason_display_order as display_order
    FROM id_remove_reason_table`;

  return new Promise((resolve, reject) => {
    db.all(colorQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: RemoveReasonInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};