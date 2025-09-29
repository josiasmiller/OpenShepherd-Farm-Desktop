import { getDatabase } from "../../../../dbConnections";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from "packages/core";
import { dateTimeAsString } from "../../../../dbUtils";

/**
 * Inserts a new location history row for an animal at birth (from null → to premise).
 * @param animalId - The animal's ID
 * @param fromPremiseId - The premise ID from where the animal comes
 * @param toPremiseId - The destination premise ID
 * @param movementDate - The date the movement occurred (YYYY-MM-DD)
 * @param isOneHourAhead - bool determining if the created/modified rows should skip an hour ahead
 * @returns Result containing the new row's UUID or an error message
 */
export async function insertAnimalGoesToLocation(
  animalId: string,
  fromPremiseId: string | null,
  toPremiseId: string | null,
  movementDate: string,
  isOneHourAhead: boolean = false,
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

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
  
  let todayDt : string;

  if (isOneHourAhead) {
    todayDt = dateTimeAsString();
  } else {
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    todayDt = dateTimeAsString(oneHourLater);
  }

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
          todayDt,
          todayDt,
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
