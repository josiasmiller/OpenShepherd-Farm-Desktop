import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { BreedingAgesResult } from "../../../../models/read/animal/breeding/breedingAges.js";

export const getBreedingAges = async (
  speciesId: string
): Promise<Result<BreedingAgesResult, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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
