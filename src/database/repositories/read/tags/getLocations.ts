import { getDatabase } from "../../../dbConnections.js";
import { Location } from "../../../models/read/tags/location.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

// Function to fetch locations from the database
export const getLocations = async (): Promise<Result<Location[], string>> => {
  const db = await getDatabase();
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
        const results: Location[] = rows.map((row: any) => ({
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
