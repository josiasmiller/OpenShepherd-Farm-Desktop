import { getDatabase } from '../../../dbConnections';
import { Result, Success, Failure } from '../../../../shared/results/resultTypes';

/**
 * Deletes all entries from animal_at_stud_table for the given animal
 * where frozen_semen is not available (i.e., frozen_semen != 1).
 *
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalAtStudEntriesWithoutFrozenSemen(
  animalId: string
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const query = `
    DELETE FROM animal_at_stud_table
    WHERE id_animalid = ?
      AND frozen_semen != 1
  `;

  return new Promise<Result<null, string>>((resolve) => {
    db.run(query, [animalId], (err: Error | null) => {
      if (err) {
        resolve(new Failure(`Failed to delete at stud entries without frozen semen: ${err.message}`));
      } else {
        resolve(new Success(null));
      }
    });
  });
}
