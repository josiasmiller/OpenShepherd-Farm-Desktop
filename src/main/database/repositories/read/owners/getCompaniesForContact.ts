import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

export type Company = {
  id: string;
  name: string;
  registry_id?: string;
};

/**
 * Gets all companies linked to a given contact.
 *
 * @param db The Database to act on
 * @param contactId UUID of the contact
 */
export async function getCompaniesForContact(
  db: Database, contactId: string
): Promise<Result<Company[], string>> {

  const query = `
    SELECT c.id_companyid AS id,
           c.company AS name,
           NULL as registry_id -- placeholder if you later add a registry id column
    FROM contact_company_table cc
    INNER JOIN company_table c ON cc.id_companyid = c.id_companyid
    WHERE cc.id_contactid = ?
  `;

  try {
    const companies = await new Promise<Company[]>((resolve, reject) => {
      db.all(query, [contactId], (err, rows) => {
        if (err) return reject(err);
        resolve((rows as Company[]) || []);
      });
    });

    return new Success(companies);
  } catch (err: any) {
    return new Failure(`Failed to fetch companies for contact: ${err.message}`);
  }
}
