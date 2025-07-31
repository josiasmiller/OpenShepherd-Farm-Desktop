import { getDatabase } from "../../../dbConnections.js";
import { TagType } from "../../../models/read/tags/tagType.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

/**
 * Gets all possible Tag Types from the DB
 * 
 * @returns A `Result` containing an array of `TagType` objects on success, 
 *          or a string error message on failure.
 */
export const getTagTypes = async (): Promise<Result<TagType[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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
