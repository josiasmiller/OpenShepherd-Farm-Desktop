import {Database} from "sqlite3";
import { State } from '@app/api';
import { Result, Success, Failure } from "@common/core";

// Define the expected structure of a row from the database
type StateRow = {
  id: string;
  name: string;
  abbrev: string;
  display_order: number;
  country_id: string;
};

/**
 * gets a specific state from the DB
 * @param db The Database to act on
 * @param stateId specific UUID of state to retrieve
 * @returns A `Result` containing a `State` object on success, 
 *          or a string error message on failure.
 */
export const getStateSpecific = async (db: Database, stateId: string): Promise<Result<State, string>> => {

  const stateQuery = `
    SELECT 
        id_stateid AS id, 
        state_name AS name,
        state_abbrev AS abbrev, 
        state_display_order AS display_order,
        id_countryid AS country_id
    FROM state_table
    WHERE id_stateid = ?
    LIMIT 1`;

  return new Promise((resolve) => {
    db.get(stateQuery, [stateId], (err, row: StateRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No state found with ID: ${stateId}`));
      } else {
        const result: State = {
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
          country_id: row.country_id,
        };
        resolve(new Success(result));
      }
    });
  });
};
