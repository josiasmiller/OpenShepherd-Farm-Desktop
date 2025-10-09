import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";
import { TagLocation } from '@app/api';

/**
 * gets all ID tag locations
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of `TagLocation` objects on success, 
 *          or a string error message on failure.
 */
export const getTagLocations = async (db: Database): Promise<Result<TagLocation[], string>> => {

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
