import { getDatabase } from "../../../dbConnections.js";
import { ColorInfo } from "../../../models/read/tags/color.js";

export const getColors = async (): Promise<ColorInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let colorQuery = `
    SELECT 
        id_idcolorid AS id, 
        id_color_name AS name,
        id_color_display_order as display_order
    FROM id_color_table`;

  return new Promise((resolve, reject) => {
    db.all(colorQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: ColorInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};