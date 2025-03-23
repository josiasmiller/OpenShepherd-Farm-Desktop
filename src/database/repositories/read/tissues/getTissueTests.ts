import { getDatabase } from "../../../dbConnections.js";
import { TissueTest } from "../../../models/read/tissues/tissueTest.js";

export const getTissueTests = async (): Promise<TissueTest[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let ttQuery = `
    SELECT 
        id_tissuetestid AS id, 
        tissue_test_name AS name,
        tissue_test_display_order as display_order
    FROM tissue_test_table`;

  return new Promise((resolve, reject) => {
    db.all(ttQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: TissueTest[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};