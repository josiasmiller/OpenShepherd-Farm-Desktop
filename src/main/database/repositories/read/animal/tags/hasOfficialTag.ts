import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

type TagQueryResponse = {
  id_scrapieflockid: string | null;
  id_number: string;
  official_id: number; // 0 or 1
};

/**
 * Checks if the given animal has an active official tag.
 *
 * Official if:
 * 1) has a non-null id_scrapieflockid AND has the flag official_id = 1 AND is the current active tag (not removed)
 * 2) Electronic tags that start with an approved 3-digit country code AND has the flag official_id = 1 AND is a current active tag (not removed)
 *
 * @param db The Database to act on
 * @param animalId UUID of the animal
 */
export async function animalHasActiveOfficialTag(
  db: Database, animalId: string
): Promise<Result<boolean, string>> {

  // Query active tags for this animal
  const tagQuery = `
    SELECT id_scrapieflockid, id_number, official_id
    FROM animal_id_info_table
    WHERE id_animalid = ?
      AND id_date_off IS NULL
      AND id_time_off IS NULL
  `;

  // Query all approved country prefixes
  const prefixQuery = `
    SELECT country_eid_prefix
    FROM country_table
    WHERE country_eid_prefix IS NOT NULL
  `;

  try {

    // Fetch all active tags
    const tags: TagQueryResponse[] = await new Promise((resolve, reject) => {
      db.all(tagQuery, [animalId], (err, rows) => {
        if (err) return reject(err);
        resolve((rows as TagQueryResponse[]) || []);
      });
    });

    if (tags.length === 0) {
      // no active tags
      return new Success(false);
    }

    // Case 1: Has a non-null scrapie flock id AND is official
    const hasOfficialScrapieTag = tags.some(
      tag => tag.official_id === 1 && tag.id_scrapieflockid !== null
    );
    if (hasOfficialScrapieTag) {
      return new Success(true);
    }

    // Case 2: Electronic tag with approved 3-digit prefix AND official
    const prefixRows: { country_eid_prefix: string }[] = await new Promise(
      (resolve, reject) => {
        db.all(prefixQuery, [], (err, rows) => {
          if (err) return reject(err);
          resolve((rows as { country_eid_prefix: string }[]) || []);
        });
      }
    );

    // Filter to strictly 3-digit numeric prefixes per official tag rule
    const approvedPrefixes = prefixRows
      .map(r => r.country_eid_prefix?.trim())
      .filter((p): p is string => /^[0-9]{3}$/.test(p));

    if (approvedPrefixes.length === 0) {
      return new Success(false);
    }

    const hasOfficialElectronicTag = tags.some(tag => {
      if (tag.official_id !== 1) return false;
      if (!tag.id_number) return false;
      return approvedPrefixes.some(prefix => tag.id_number.startsWith(prefix));
    });

    return new Success(hasOfficialElectronicTag);
  } catch (err: any) {
    return new Failure(`Failed to check official tag: ${err.message}`);
  }
}
