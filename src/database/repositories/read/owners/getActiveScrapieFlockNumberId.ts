import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";

/**
 * Retrieves the most recent active scrapie flock number ID for the given owner.
 * @param ownerId UUID of the owner (can be contact or company)
 */
export async function getActiveScrapieFlockNumberId(
  ownerId: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

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

    if (!row) return new Failure("No active scrapie flock number found for the given owner ID");

    return new Success(row.id_scrapieflocknumberid);
  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}
