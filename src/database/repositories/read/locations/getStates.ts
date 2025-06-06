import { getDatabase } from "../../../dbConnections";
import { State } from "../../../models/read/locations/state";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

// Function to fetch states from the database
export const getStates = async (): Promise<Result<State[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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
