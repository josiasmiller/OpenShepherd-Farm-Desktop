import { getDatabase } from "../../../dbConnections.js";
import { Premise } from "../../../models/read/premises/premise.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

// Function to fetch premises from the database
export const getPremises = async (): Promise<Result<Premise[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let premiseQuery = `
    SELECT 
        p.id_premiseid AS premise_id, 
        p.premise_address1 AS address_one,
        p.premise_city AS city,
        p.premise_postcode AS postcode,
        c.country_name AS country_name
    FROM 
        premise_table p
    JOIN 
        country_table c ON p.premise_id_countryid = c.id_countryid`;

  return new Promise((resolve) => {
    db.all(premiseQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of Premise objects and return Success
        const results: Premise[] = rows.map((row: any) => ({
          id: row.premise_id,
          address: row.address_one,
          city: row.city,
          postcode: row.postcode,
          country: row.country_name,
        }));

        resolve(new Success(results)); // Return success with the premises data
      }
    });
  });
};
