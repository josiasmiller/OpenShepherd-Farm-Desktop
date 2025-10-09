import {Database} from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from "@common/core";
import { dateTimeAsString } from "../../../../dbUtils";

/**
 * Inserts a new location history row for an animal at birth (from null → to premise).
 * @param db The Database to act on
 * @param animalId - The animal's ID
 * @param fromPremiseId - The premise ID from where the animal comes
 * @param toPremiseId - The destination premise ID
 * @param movementDate - The date the movement occurred (YYYY-MM-DD)
 * @param timestamp - Optional timestamp for created/modified fields. Defaults to now.
 * @returns Result containing the new row's UUID or an error message
 */
export async function insertAnimalGoesToLocation(
  db: Database,
  animalId: string,
  fromPremiseId: string | null,
  toPremiseId: string | null,
  movementDate: string,
  timestamp: string = dateTimeAsString()
): Promise<Result<string, string>> {

  const idAnimalLocationHistoryId = uuidv4();

  const query = `
    INSERT INTO animal_location_history_table (
      id_animallocationhistoryid,
      id_animalid,
      movement_date,
      from_id_premiseid,
      to_id_premiseid,
      created,
      modified
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(
        query,
        [
          idAnimalLocationHistoryId,
          animalId,
          movementDate,
          fromPremiseId,
          toPremiseId,
          timestamp,
          timestamp,
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
