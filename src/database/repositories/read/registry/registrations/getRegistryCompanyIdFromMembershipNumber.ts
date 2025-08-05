import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";

/**
 * Retrieves the id_registry_id_companyid from owner_registration_table
 * based on the given membership_number.
 */
export async function getRegistryCompanyIdForMembershipNumber(
  membershipNumber: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT id_registry_id_companyid
    FROM owner_registration_table
    WHERE membership_number = ?
  `;

  try {
    const row = await new Promise<{ id_registry_id_companyid: string } | undefined>((resolve, reject) => {
      db.get(query, [membershipNumber], (err, row) => {
        if (err) reject(err);
        else resolve(row as { id_registry_id_companyid: string } | undefined);
      });
    });

    if (!row) {
      return new Failure(`No registry company ID found for membership number: ${membershipNumber}`);
    }

    return new Success(row.id_registry_id_companyid);
  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}
