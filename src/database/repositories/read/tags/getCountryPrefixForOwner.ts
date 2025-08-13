import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

/**
 * Get the 3-digit country prefix for a given owner.
 * 
 * @param ownerId UUID of the owner
 * @param isCompany boolean - true if owner is a company, false if contact
 * @returns Success(country_eid_prefix) or Failure if not found
 */
export const getCountryPrefixForOwner = async (
  ownerId: string,
  isCompany: boolean
): Promise<Result<string, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB instance is null");
  }

  // Choose the correct join table
  const premiseJoinTable = isCompany ? "company_premise_table" : "contact_premise_table";
  const ownerColumn = isCompany ? "id_companyid" : "id_contactid";

  const query = `
    SELECT c.country_eid_prefix
    FROM ${premiseJoinTable} AS p
    JOIN premise_table AS pr ON p.id_premiseid = pr.id_premiseid
    JOIN country_table AS c ON pr.premise_id_countryid = c.id_countryid
    WHERE p.${ownerColumn} = ?
      AND (p.end_premise_use IS NULL OR date(p.end_premise_use) >= date('now'))
    LIMIT 1
  `;

  try {
    const countryPrefix = await new Promise<string | null>((resolve, reject) => {
      db.get(query, [ownerId], (err, row : { country_eid_prefix: string, }) => {
        if (err) return reject(err);
        resolve(row ? row.country_eid_prefix : null);
      });
    });

    if (!countryPrefix) {
      return new Failure(
        `No active premises with country found for ownerId '${ownerId}'`
      );
    }

    return new Success(countryPrefix);
  } catch (err: any) {
    return new Failure(`Database query failed: ${err.message}`);
  }
};
