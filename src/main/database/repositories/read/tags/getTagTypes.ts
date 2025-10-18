import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { TagType } from "packages/api";

/**
 * Gets all possible Tag Types from the DB
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of `TagType` objects on success, 
 *          or a string error message on failure.
 */
export const getTagTypes = async (db: Database): Promise<Result<TagType[], string>> => {

  let tagTypeQuery = `
    SELECT 
        id_idtypeid AS id, 
        id_type_name AS name,
        id_type_display_order as display_order
    FROM id_type_table`;

  return new Promise((resolve) => {
    db.all(tagTypeQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of TagType objects and return Success
        const results: TagType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
