import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

/**
 * Checks if the given animal has an active federal tag.
 * 
 * An federal tag is considered active if:
 * - id_scrapieflockid != NULL
 * - id_date_off IS NULL
 * - id_time_off IS NULL
 *
 * @param db The Database to act on
 * @param animalId UUID of the animal
 */
export async function animalHasActiveFederalTag(
  db: Database, animalId: string
): Promise<Result<boolean, string>> {

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
    const hasFederalTag = await new Promise<boolean>((resolve, reject) => {
      db.get(query, [animalId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });

    return new Success(hasFederalTag);
  } catch (err: any) {
    return new Failure(`Failed to check official tag: ${err.message}`);
  }
}
