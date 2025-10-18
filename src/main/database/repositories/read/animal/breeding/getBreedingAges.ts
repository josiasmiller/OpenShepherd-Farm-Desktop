import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { BreedingAgesResult } from "../../../../models/read/animal/breeding/breedingAges";

/**
 * gets the breeding ages of a given species
 * @param db The Database to act on
 * @param speciesId UUID of the species being sought
 * @returns A `Result` containing a `BreedingAgesResult` object on success, 
 *          or a string error message on failure.
 */
export const getBreedingAges = async (
  db: Database, speciesId: string
): Promise<Result<BreedingAgesResult, string>> => {

  const query = `
    SELECT
      early_male_breeding_age_days,
      early_female_breeding_age_days
    FROM species_table
    WHERE id_speciesid = ?;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [speciesId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
        return;
      }

      const row = rows[0] as {
        early_male_breeding_age_days: number;
        early_female_breeding_age_days: number;
      };

      if (row) {
        resolve(
          new Success({
            maleDays: row.early_male_breeding_age_days,
            femaleDays: row.early_female_breeding_age_days,
          })
        );
      } else {
        resolve(new Failure(`No species found for ID '${speciesId}'`));
      }
    });
  });
};
