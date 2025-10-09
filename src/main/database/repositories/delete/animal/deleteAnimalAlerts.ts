import {Database} from "sqlite3";
import { Result, Success, Failure } from '@common/core';

/**
 * Deletes all entries from the animal_alert_table for the given animal.
 *
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalAlerts(db: Database, animalId: string): Promise<Result<null, string>> {

  const query = `DELETE FROM animal_alert_table WHERE id_animalid = ?`;

  return new Promise<Result<null, string>>((resolve) => {
    db.run(query, [animalId], (err: Error | null) => {
      if (err) {
        resolve(new Failure(`Failed to delete animal alerts: ${err.message}`));
      } else {
        resolve(new Success(null));
      }
    });
  });
}
