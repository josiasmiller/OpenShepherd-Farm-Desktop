import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

/**
 * gets all tag country EID prefixes from the DB
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of strings on success, 
 *          or a string error message on failure.
 */
export const getAllCountryTagPrefixes = async (db: Database): Promise<Result<string[], string>> => {

  let tagQuery = `
    SELECT 
        country_eid_prefix
    FROM country_table`;

  return new Promise((resolve) => {
    db.all(tagQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of string prefixes
        const results: string[] = rows.map((row: any) => row.country_eid_prefix);

        resolve(new Success(results));
      }
    });
  });
};
