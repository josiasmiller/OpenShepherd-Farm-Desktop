import { getDatabase } from "../../../dbConnections";
import { TissueSampleContainerType } from "../../../models/read/tissues/tissueSampleContainerType";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

/**
 * gets all tissue sample container types from the DB
 * 
 * @returns A `Result` containing an array of `TissueSampleContainerType` objects on success, 
 *          or a string error message on failure.
 */
export const getTissueSampleContainerTypes = async (): Promise<Result<TissueSampleContainerType[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const tstQuery = `
    SELECT 
        id_tissuesamplecontainertypeid AS id, 
        tissue_sample_container_name AS name,
        tissue_sample_container_display_order as display_order
    FROM tissue_sample_container_type_table`;

  return new Promise((resolve) => {
    db.all(tstQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        const results: TissueSampleContainerType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
