import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

export async function getFlockPrefixIdByMembershipNumber(
  membershipNumber: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT id_flockprefixid
    FROM owner_registration_table
    WHERE membership_number = ?
    LIMIT 1
  `;

  try {
    const row = await new Promise<{ id_flockprefixid: string } | undefined>(
      (resolve, reject) => {
        db.get(query, [membershipNumber], (err, row: { id_flockprefixid: string } | undefined) => {
          if (err) reject(err);
          else resolve(row);
        });
      }
    );

    if (!row) {
      return new Failure(`No owner registration found for membership number ${membershipNumber}`);
    }

    return new Success(row.id_flockprefixid);
  } catch (err: any) {
    return new Failure(`Database query failed: ${err.message}`);
  }
}
