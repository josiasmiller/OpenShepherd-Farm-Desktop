import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { TissueSampleType } from "packages/api";

/**
 * gets all tissue sample types from the DB 
 * 
 * @returns A `Result` containing an array of `TissueSampleType` objects on success, 
 *          or a string error message on failure.
 */
export const getTissueSampleTypes = async (): Promise<Result<TissueSampleType[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let tstQuery = `
    SELECT 
        id_tissuesampletypeid AS id, 
        tissue_sample_type_name AS name,
        tissue_sample_type_display_order as display_order
    FROM tissue_sample_type_table`;

  return new Promise((resolve) => {
    db.all(tstQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of TissueSampleType objects and return Success
        const results: TissueSampleType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
