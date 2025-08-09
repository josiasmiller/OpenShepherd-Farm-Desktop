import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";

/**
 * Checks if the given animal has an active official tag.
 * 
 * An official tag is considered active if:
 * - id_scrapieflockid != NULL
 * - id_date_off IS NULL
 * - id_time_off IS NULL
 * 
 * @param animalId UUID of the animal
 */
export async function animalHasActiveFederalTag(
  animalId: string
): Promise<Result<boolean, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT 1
    FROM animal_id_info_table
    WHERE id_animalid = ?
      AND id_scrapieflockid IS NOT NULL
      AND id_date_off IS NULL
      AND id_time_off IS NULL
    LIMIT 1
  `;

  try {
    const hasOfficialTag = await new Promise<boolean>((resolve, reject) => {
      db.get(query, [animalId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });

    return new Success(hasOfficialTag);
  } catch (err: any) {
    return new Failure(`Failed to check official tag: ${err.message}`);
  }
}
