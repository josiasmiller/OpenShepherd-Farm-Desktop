import { getDatabase } from "../../../dbConnections";
import { TissueTest } from "../../../models/read/tissues/tissueTest";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

// Function to get TissueTests with Result type handling for success and failure
export const getTissueTests = async (): Promise<Result<TissueTest[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let ttQuery = `
    SELECT 
        id_tissuetestid AS id, 
        tissue_test_name AS name,
        tissue_test_display_order as display_order
    FROM tissue_test_table`;

  return new Promise<Result<TissueTest[], string>>((resolve) => {
    db.all(ttQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(err.message)); // Return Failure with the error message
      } else {
        const results: TissueTest[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));
        resolve(new Success(results)); // Return Success with the data
      }
    });
  });
};
