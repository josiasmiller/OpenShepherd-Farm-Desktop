import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";

/**
 * gets the UUID of the flock prefix of a given owner
 *
 * @param db The Database to act on
 * @param membershipNumber membership number of the owner
 * @returns A `Result` containing a string on success, 
 *          or a string error message on failure.
 */
export async function getFlockPrefixIdByMembershipNumber(
  db: Database, membershipNumber: string
): Promise<Result<string, string>> {

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
