import {Database} from "sqlite3";
import { getPremiseSpecific } from "./getPremiseSpecific"; // Adjust import if path differs
import { Result, Failure } from "packages/core";
import { Premise } from "packages/api";

/**
 * gets the premise for a given contact
 *
 * @param db The Database to act on
 * @param contactId UUID of the company being sought
 * @returns A `Result` containing a `Premise` object on success, 
 *          or a string error message on failure.
 */
export const getContactPremise = async (db: Database, contactId: string): Promise<Result<Premise, string>> => {

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
        
        const result = await getPremiseSpecific(db, row.id_premiseid);
        resolve(result);
      }
    });
  });
};
