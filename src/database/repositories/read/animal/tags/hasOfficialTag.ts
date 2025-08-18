import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";


type TagQueryResponse = { 
  id_scrapieflockid: string | null; 
  id_number: string
}

/**
 * Checks if the given animal has an active official tag.
 * Official if:
 *  1) Any active tag has a non-null id_scrapieflockid
 *  2) OR any active tag's id_number starts with a known country_eid_prefix
 * 
 * @param animalId UUID of the animal
 */
export async function animalHasActiveOfficialTag(
  animalId: string
): Promise<Result<boolean, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  // Get all active tags for this animal
  const tagQuery = `
    SELECT id_scrapieflockid, id_number
    FROM animal_id_info_table
    WHERE id_animalid = ?
      AND id_date_off IS NULL
      AND id_time_off IS NULL
  `;

  // Get all known country prefixes
  const prefixQuery = `
    SELECT country_eid_prefix
    FROM country_table
  `;

  try {
    const tags = await new Promise<{ id_scrapieflockid: string | null; id_number: string }[]>((resolve, reject) => {
      db.all(tagQuery, [animalId], (err, rows) => {
        if (err) return reject(err);
        resolve((rows as TagQueryResponse[]) || []);
      });
    });

    if (tags.length === 0) {
      return new Success(false); // no active tags at all
    }

    // Case 1: scrapie flock id present
    if (tags.some(tag => tag.id_scrapieflockid !== null)) {
      return new Success(true);
    }

    // Otherwise, check prefixes
    const prefixes = await new Promise<string[]>((resolve, reject) => {
      db.all(prefixQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map((r: { country_eid_prefix: string }) => r.country_eid_prefix));
      });
    });

    // Case 2: tag number starts with a country prefix
    const hasCountryPrefix = tags.some(tag =>
      prefixes.some(prefix => tag.id_number?.startsWith(prefix))
    );

    return new Success(hasCountryPrefix);
  } catch (err: any) {
    return new Failure(`Failed to check official tag: ${err.message}`);
  }
}
