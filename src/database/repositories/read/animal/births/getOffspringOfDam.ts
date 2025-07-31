import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { OffspringInfo } from "../../../../models/read/animal/births/offspringInfo.js";

/**
 * Fetch all animals where the given animalId is the genetic dam.
 * @returns A `Result` containing an array of `OffspringInfo` objects on success, 
 *          or a string error message on failure.
 */
export const getOffspringOfDam = async (
  damId: string
): Promise<Result<OffspringInfo[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const query = `
    SELECT
      id_animalid AS id,
      birth_date AS birthdate
    FROM animal_table
    WHERE dam_id = ?
      AND birth_date IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [damId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: OffspringInfo[] = rows.map((row: any) => ({
          id: row.id,
          birthdate: row.birthdate,
        }));

        resolve(new Success(results));
      }
    });
  });
};
