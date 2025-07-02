import { Result, Success, Failure } from "../../shared/results/resultTypes.js";
import { getDatabase } from "../dbConnections.js";

export type GestationPeriod = {
  earlyDays: number;
  lateDays: number;
}

export const getGestationPeriod = async (
  speciesId: string
): Promise<Result<GestationPeriod, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB Instance is null");
  }

  const query = `
    SELECT early_gestation_length_days AS earlyDays,
           late_gestation_length_days AS lateDays
    FROM species_table
    WHERE id_speciesid = ?;
  `;

  return new Promise((resolve) => {
    db.get(query, [speciesId], (err, row: GestationPeriod) => {
      if (err) {
        resolve(new Failure(`Error querying gestation period: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No species found with ID: ${speciesId}`));
      } else {
        resolve(new Success({
          earlyDays: row.earlyDays,
          lateDays: row.lateDays
        }));
      }
    });
  });
};
