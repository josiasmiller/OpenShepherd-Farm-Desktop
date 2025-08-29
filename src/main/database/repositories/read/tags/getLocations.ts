import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { TagLocation } from "packages/api";

/**
 * gets all ID tag locations
 * 
 * @returns A `Result` containing an array of `TagLocation` objects on success, 
 *          or a string error message on failure.
 */
export const getTagLocations = async (): Promise<Result<TagLocation[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let locationQuery = `
    SELECT 
        id_idlocationid AS id, 
        id_location_name AS name,
        id_location_abbrev as abbrev,
        id_location_display_order as display_order
    FROM id_location_table`;

  return new Promise((resolve) => {
    db.all(locationQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of Location objects and return Success
        const results: TagLocation[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
