import { getDatabase } from "../../../dbConnections.js";
import { TissueSampleType } from "../../../models/read/tissues/tissueSampleType.js";

export const getTissueSampleTypes = async (): Promise<TissueSampleType[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let tstQuery = `
    SELECT 
        id_tissuesampletypeid AS id, 
        tissue_sample_type_name AS name,
        tissue_sample_type_display_order as display_order
    FROM tissue_sample_type_table`;

  return new Promise((resolve, reject) => {
    db.all(tstQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: TissueSampleType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};