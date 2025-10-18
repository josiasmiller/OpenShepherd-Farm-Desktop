import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { EVALUATION_WEIGHT } from "../../../../dbConstants";

type WeightResponse = {
  weight: number;
  ageInDays : number
}

/**
 * estimates the 50 day weight of an animal based on the available information in the database.
 * NOTE: this function returns a success with a number `0` when unable to calculate the 50 day weight.
 *       Failures only occur when a DB issue crops up
 *
 * @param db The Database to act on
 * @param animalId UUID of animal being sought
 * @returns A `Result` containing a number on success, 
 *          or a string error message on failure.
 */
export const estimateFiftyDayWeight = async (
  db: Database, animalId: string
): Promise<Result<number, string>> => {

  const query = `
    SELECT 
        trait_score11 AS weight, 
        age_in_days AS ageInDays
    FROM animal_evaluation_table
    WHERE id_animalid = ?
      AND age_in_days BETWEEN 40 AND 120
      AND trait_score11 IS NOT NULL
      AND trait_name11 = '${EVALUATION_WEIGHT}'  -- ensure trait 11 actually is weight and not some random evaluation  
    ORDER BY eval_date DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], (err, row: WeightResponse | undefined) => {
      if (err) {
        resolve(new Failure(`Database error: ${err.message}`));
      } else if (!row || !row.weight || !row.ageInDays || row.ageInDays <= 0) {
        resolve(new Success(0.0)); // for now, we will return `0` when no 50 day weight is found instead of failing out
      } else {
        const adg = row.weight / row.ageInDays; // ADG --> Average Daily Gain
        const weight50 = parseFloat((adg * 50).toFixed(2));
        resolve(new Success(weight50));
      }
    });
  });
};
