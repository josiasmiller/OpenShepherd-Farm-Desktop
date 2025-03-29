import { getDatabase } from "../../../dbConnections.js";
import { Owner } from "../../../models/read/owners/owner.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

// Function to fetch owners from the database
export const getOwners = async (): Promise<Result<Owner[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let ownerQuery = `
    SELECT 
        id_contactid AS contact_id, 
        contact_first_name AS first_name, 
        contact_last_name AS last_name
    FROM 
        contact_table`;

  return new Promise((resolve) => {
    db.all(ownerQuery, [], (err, rows) => {
      if (err) {
        // On query error, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // On success, map the rows into a list of Owner objects and return Success
        const results: Owner[] = rows.map((row: any) => ({
          id: row.contact_id,
          firstName: row.first_name,
          lastName: row.last_name,
        }));

        resolve(new Success(results));
      }
    });
  });
};
