import { getDatabase } from "../../../dbConnections";
import { Premise } from "../../../models/read/premises/premise";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";
import { State } from "../../../models/read/locations/state";

// Define the row type for the query to help with typings
type PremiseRow = {
  premise_id: string;
  address_one: string;
  city: string;
  postcode: string;
  country_name: string;
  state_id: string;
  state_name: string;
  state_abbrev: string;
  state_display_order: number;
  state_country_id: string;
};

/**
 * gets all premises from the DB
 * @returns A `Result` containing an array of `Premise` objects on success, 
 *          or a string error message on failure.
 */
export const getPremises = async (): Promise<Result<Premise[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const premiseQuery = `
    SELECT 
        p.id_premiseid AS premise_id, 
        p.premise_address1 AS address_one,
        p.premise_city AS city,
        p.premise_postcode AS postcode,
        c.country_name AS country_name,
        s.id_stateid AS state_id,
        s.state_name AS state_name,
        s.state_abbrev AS state_abbrev,
        s.state_display_order AS state_display_order,
        s.id_countryid AS state_country_id
    FROM premise_table p
    JOIN country_table c ON p.premise_id_countryid = c.id_countryid
    LEFT JOIN state_table s ON p.premise_id_stateid = s.id_stateid
  `;

  return new Promise((resolve) => {
    db.all(premiseQuery, [], (err, rows: PremiseRow[]) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        const results: Premise[] = rows.map(row => ({
          id: row.premise_id,
          address: row.address_one,
          city: row.city,
          postcode: row.postcode,
          country: row.country_name,
          state: {
            id: row.state_id,
            name: row.state_name,
            abbreviation: row.state_abbrev,
            display_order: row.state_display_order,
            country_id: row.state_country_id,
          } as State,
        }));

        resolve(new Success(results));
      }
    });
  });
};
