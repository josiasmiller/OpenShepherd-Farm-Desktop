import { getDatabase } from '../../../../dbConnections';
import { v4 as uuidv4 } from 'uuid';
import { Result, Success, Failure } from 'packages/core/src/resultTypes';
import { getCurrentDateTime } from '../../../../dbUtils';


type LastLocationQueryRow = { 
  from_id_premiseid: string | null, 
  to_id_premiseid: string | null 
}

/**
 * Records a location move from the animal's current location to NULL on the date of death.
 * This indicates the animal has left its last known location due to death.
 *
 * @param animalId - The ID of the deceased animal.
 * @param deathDate - The date of death (used as movement_date).
 * @returns Result<void, string>
 */
export async function markAnimalDeathLocation(
  animalId: string,
  deathDate: string
): Promise<Result<void, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const newId = uuidv4();

  try {
    // Step 1: Look up the most recent location record
    const lastLocation: LastLocationQueryRow | undefined =
      await new Promise((resolve, reject) => {
        db.get(
          `
          SELECT to_id_premiseid 
          FROM animal_location_history_table
          WHERE id_animalid = ?
          AND to_id_premiseid IS NOT NULL
          ORDER BY movement_date DESC
          LIMIT 1
          `,
          [animalId],
          (err, row : LastLocationQueryRow) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

    if (!lastLocation || !lastLocation.to_id_premiseid) {
      return new Failure(`No existing location found for animal ID: ${animalId}`);
    }

    const fromPremiseId = lastLocation.to_id_premiseid;

    // Step 2: Insert a new movement from last known location to NULL (death)
    await new Promise<void>((resolve, reject) => {

      const todayDt : String = getCurrentDateTime();

      db.run(
        `
        INSERT INTO animal_location_history_table (
          id_animallocationhistoryid,
          id_animalid,
          movement_date,
          from_id_premiseid,
          to_id_premiseid,
          created,
          modified
        ) VALUES (?, ?, ?, ?, NULL, ?, ?)
        `,
        [newId, animalId, deathDate, fromPremiseId, todayDt, todayDt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return new Success(undefined);
  } catch (err: any) {
    return new Failure(`Failed to mark animal death location: ${err.message}`);
  }
}
