import {Database} from "sqlite3";
import { State } from "packages/api";
import { Result, Success, Failure } from "packages/core";

/**
 * gets all states from the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `State` objects on success, 
 *          or a string error message on failure.
 */
export const getStates = async (db: Database): Promise<Result<State[], string>> => {

  let stateQuery = `
    SELECT 
        id_stateid AS id, 
        state_name AS name,
        state_abbrev as abbrev, 
        state_display_order as display_order,
        id_countryid as country_id
    FROM state_table`;

  return new Promise((resolve) => {
    db.all(stateQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of State objects and return Success
        const results: State[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
          country_id: row.country_id,
        }));

        resolve(new Success(results));
      }
    });
  });
};
