import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

/**
 * Checks if the given owner UUID belongs to a company.
 * Fails if the owner ID does not exist in either company_table or contact_table.
 *
 * @param db The Database to act on
 * @param ownerId UUID of the owner (either company ID or contact ID)
 * @returns Success(true) if company, Success(false) if contact, Failure if not found
 */
export const isOwnerCompany = async (
  db: Database, ownerId: string
): Promise<Result<boolean, string>> => {

  const companyQuery = `
    SELECT 1
    FROM company_table
    WHERE id_companyid = ?
    LIMIT 1
  `;

  const contactQuery = `
    SELECT 1
    FROM contact_table
    WHERE id_contactid = ?
    LIMIT 1
  `;

  try {
    // First check: is it a company?
    const isCompany = await new Promise<boolean>((resolve, reject) => {
      db.get(companyQuery, [ownerId], (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      });
    });

    if (isCompany) {
      return new Success(true);
    }

    // Second check: is it a contact?
    const isContact = await new Promise<boolean>((resolve, reject) => {
      db.get(contactQuery, [ownerId], (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      });
    });

    if (isContact) {
      return new Success(false);
    }

    // If it's in neither table
    return new Failure(`Owner ID '${ownerId}' does not exist in company_table or contact_table.`);

  } catch (err: any) {
    return new Failure(`Database query failed: ${err.message}`);
  }
};
