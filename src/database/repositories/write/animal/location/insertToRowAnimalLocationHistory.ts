import { getDatabase } from "../../../../dbConnections.js";
import { getSQLiteDateStringNow } from "../../../../dbUtils.js";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

/**
 * Inserts a new location history row for an animal at birth (from null → to premise).
 * @param animalId - The animal's ID
 * @param premiseId - The destination premise ID
 * @param movementDate - The date the movement occurred (YYYY-MM-DD)
 * @returns Result containing the new row's UUID or an error message
 */
export async function insertAnimalGoesToLocation(
  animalId: string,
  premiseId: string,
  movementDate: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const idAnimalLocationHistoryId = uuidv4();
  const created = getSQLiteDateStringNow();
  const modified = created;

  const query = `
    INSERT INTO animal_location_history_table (
      id_animallocationhistoryid,
      id_animalid,
      movement_date,
      from_id_premiseid,
      to_id_premiseid,
      created,
      modified
    ) VALUES (?, ?, ?, NULL, ?, ?, ?)
  `;

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(
        query,
        [
          idAnimalLocationHistoryId,
          animalId,
          movementDate,
          premiseId,
          created,
          modified,
        ],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return new Success(idAnimalLocationHistoryId);
  } catch (err: any) {
    return new Failure(`Failed to insert animal location history: ${err.message}`);
  }
}
