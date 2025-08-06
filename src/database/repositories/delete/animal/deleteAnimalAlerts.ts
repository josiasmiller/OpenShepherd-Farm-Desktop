import { getDatabase } from '../../../dbConnections';
import { Result, Success, Failure } from '../../../../shared/results/resultTypes';

/**
 * Deletes all entries from the animal_alert_table for the given animal.
 *
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalAlerts(animalId: string): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

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
