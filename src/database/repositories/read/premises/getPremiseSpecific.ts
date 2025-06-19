import { getDatabase } from "../../../dbConnections.js";
import { Premise } from "../../../models/read/premises/premise.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

// Define the expected structure of a row from the database
type PremiseRow = {
  premise_id: string;
  address_one: string;
  city: string;
  postcode: string;
  country_name: string;
};

// Function to fetch a single premise from the database using premiseId
export const getPremiseSpecific = async (premiseId: string): Promise<Result<Premise, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const premiseQuery = `
    SELECT 
        p.id_premiseid AS premise_id, 
        p.premise_address1 AS address_one,
        p.premise_city AS city,
        p.premise_postcode AS postcode,
        c.country_name AS country_name
    FROM 
        premise_table p
    JOIN 
        country_table c ON p.premise_id_countryid = c.id_countryid
    WHERE
        p.id_premiseid = ?
    LIMIT 1`;

  return new Promise((resolve) => {
    db.get(premiseQuery, [premiseId], (err, row: PremiseRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No premise found with ID: ${premiseId}`));
      } else {
        const result: Premise = {
          id: row.premise_id,
          address: row.address_one,
          city: row.city,
          postcode: row.postcode,
          country: row.country_name,
        };

        resolve(new Success(result));
      }
    });
  });
};
