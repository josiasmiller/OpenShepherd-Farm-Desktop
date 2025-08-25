import { getDatabase } from "../../../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { BirthType } from "packages/api";

/**
 * Retrieves all birth types from the database.
 *
 * @returns A `Result` containing an array of `BirthType` objects on success, 
 *          or a string error message on failure.
 */
export const getBirthTypes = async (): Promise<Result<BirthType[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const birthTypeQuery = `
    SELECT 
        id_birthtypeid AS id, 
        birth_type AS name,
        birth_type_abbrev as abbrev, 
        birth_type_display_order as display_order
    FROM birth_type_table`;

  return new Promise((resolve, reject) => {
    db.all(birthTypeQuery, [], (err, rows) => {
      if (err) {
        reject(new Failure<string>(err.message));  // Reject with failure, sending error message
      } else {
        const results: BirthType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        }));

        resolve(new Success<BirthType[]>(results));  // Resolve with success and results
      }
    });
  });
};
