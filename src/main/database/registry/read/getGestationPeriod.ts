import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

export type GestationPeriod = {
  earlyDays: number;
  lateDays: number;
}

export const getGestationPeriod = async (
  db: Database, speciesId: string
): Promise<Result<GestationPeriod, string>> => {

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
