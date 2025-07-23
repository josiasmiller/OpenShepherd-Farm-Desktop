import { getDatabase } from "../../../dbConnections";
import { Country } from "../../../models/read/locations/country";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

/**
 * gets all countries from the DB
 * @returns A `Result` containing an array of `Country` objects on success, 
 *          or a string error message on failure.
 */
export const getCountries = async (): Promise<Result<Country[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let countryQuery = `
    SELECT 
        id_countryid AS id, 
        country_name AS name,
        country_abbrev as abbrev, 
        country_name_display_order as display_order
    FROM country_table`;

  return new Promise((resolve) => {
    db.all(countryQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of Country objects and return Success
        const results: Country[] = rows.map((row: any) => ({
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
