import { getDatabase } from "../../../dbConnections";
import { getPremiseSpecific } from "./getPremiseSpecific"; // Adjust import if path differs
import { Premise } from "../../../models/read/premises/premise";
import { Result, Failure } from "../../../../shared/results/resultTypes";

/**
 * gets the premise for a given contact
 * @param contactId UUID of the company being sought
 * @returns A `Result` containing a `Premise` object on success, 
 *          or a string error message on failure.
 */
export const getContactPremise = async (contactId: string): Promise<Result<Premise, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const contactPremiseQuery = `
    SELECT 
      id_premiseid
    FROM 
      contact_premise_table
    WHERE 
      id_contactid = ?
    ORDER BY 
      start_premise_use DESC
    LIMIT 1`;

  return new Promise((resolve) => {
    db.get(contactPremiseQuery, [contactId], async (err, row: { id_premiseid: string } | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No premise found for contact ID: ${contactId}`));
      } else {
        
        const result = await getPremiseSpecific(row.id_premiseid);
        resolve(result);
      }
    });
  });
};
