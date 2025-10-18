import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

/**
 * Retrieves the most recent active scrapie flock number ID for the given owner.
 * @param db The Database to act on
 * @param ownerId UUID of the owner (can be contact or company)
 * @returns A `Result` containing a string on success,
 *          or a string error message on failure.
 */
export async function getActiveScrapieFlockNumberId(
  db: Database, ownerId: string
): Promise<Result<string | null, string>> {

  const query = `
    SELECT id_scrapieflocknumberid
    FROM scrapie_flock_owner_table
    WHERE end_scrapie_flock_use IS NULL
      AND (owner_id_contactid = ? OR owner_id_companyid = ?)
    ORDER BY start_scrapie_flock_use DESC
    LIMIT 1
  `;

  try {
    const row = await new Promise<{ id_scrapieflocknumberid: string } | undefined>((resolve, reject) => {
      db.get(query, [ownerId, ownerId], (err, row) => {
        if (err) reject(err);
        else resolve(row as { id_scrapieflocknumberid: string } | undefined);
      });
    });

    if (!row) return new Success(null); // if no scrapie flock ID found, return null

    return new Success(row.id_scrapieflocknumberid);
  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}
