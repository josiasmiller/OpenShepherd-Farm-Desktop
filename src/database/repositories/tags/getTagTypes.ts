import { getDatabase } from "../../dbConnections.js";
import { TagTypeInfo } from "../../models/tags/tagType.js";

export const getTagTypes = async (): Promise<TagTypeInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let colorQuery = `
    SELECT 
        id_idtypeid AS id, 
        id_type_name AS name,
        id_type_display_order as display_order
    FROM id_type_table`;

  return new Promise((resolve, reject) => {
    db.all(colorQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: TagTypeInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};