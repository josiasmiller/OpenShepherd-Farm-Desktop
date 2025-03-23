import { getDatabase } from "../../../dbConnections.js";
import { TissueSampleContainerType } from "../../../models/read/tissues/tissueSampleContainerType.js";

export const getTissueSampleContainerTypes = async (): Promise<TissueSampleContainerType[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let tstQuery = `
    SELECT 
        id_tissuesamplecontainertypeid AS id, 
        tissue_sample_container_name AS name,
        tissue_sample_container_display_order as display_order
    FROM tissue_sample_container_type_table`;

  return new Promise((resolve, reject) => {
    db.all(tstQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: TissueSampleContainerType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};