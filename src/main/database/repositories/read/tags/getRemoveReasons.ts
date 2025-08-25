import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { RemoveReason } from "packages/api";

/**
 * gets all DI remove reasons from the DB
 * 
 * @returns A `Result` containing an array of `RemoveReason` objects on success, 
 *          or a string error message on failure.
 */
export const getRemoveReasons = async (): Promise<Result<RemoveReason[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const removeReasonQuery = `
    SELECT 
        id_idremovereasonid AS id, 
        id_remove_reason AS name,
        id_remove_reason_display_order as display_order
    FROM id_remove_reason_table`;

  return new Promise((resolve) => {
    db.all(removeReasonQuery, [], (err, rows) => {
      if (err) {
        // If an error occurs during the query, return a Failure result with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into an array of RemoveReason objects and return a Success result
        const results: RemoveReason[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
