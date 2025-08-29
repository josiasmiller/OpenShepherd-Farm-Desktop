import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { Color } from "packages/api";

/**
 * gets all tag colors from the DB
 * 
 * @returns A `Result` containing an array of `Color` objects on success, 
 *          or a string error message on failure.
 */
export const getColors = async (): Promise<Result<Color[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let colorQuery = `
    SELECT 
        id_idcolorid AS id, 
        id_color_name AS name,
        id_color_display_order as display_order
    FROM id_color_table`;

  return new Promise((resolve) => {
    db.all(colorQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of Color objects and return Success
        const results: Color[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
