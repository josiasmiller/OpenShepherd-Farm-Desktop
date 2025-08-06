import { getDatabase } from '../../../dbConnections';
import { Result, Success, Failure } from '../../../../shared/results/resultTypes';

/**
 * Deletes an animal's record from animal_for_sale_table.
 *
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalForSaleEntry(animalId: string): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const query = `DELETE FROM animal_for_sale_table WHERE id_animalid = ?`;

  return new Promise<Result<null, string>>((resolve) => {
    db.run(query, [animalId], (err: Error | null) => {
      if (err) {
        resolve(new Failure(`Failed to delete animal for sale entry: ${err.message}`));
      } else {
        resolve(new Success(null));
      }
    });
  });
}
