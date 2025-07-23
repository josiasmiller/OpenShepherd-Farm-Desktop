import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { EVALUATION_WEIGHT } from "../../../../dbConstants.js";

type WeightResponse = {
  weight: number;
  ageInDays : number
}

export const estimateFiftyDayWeight = async (
  animalId: string
): Promise<Result<number, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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
