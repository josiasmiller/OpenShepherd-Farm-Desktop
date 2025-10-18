import {Database} from "sqlite3";
import { Result, Success, Failure } from 'packages/core/src/resultTypes';

/**
 * Deletes an animal's record(s) from animal_for_sale_table.
 * @param db - The Database to act on.
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalForSaleEntry(db: Database, animalId: string): Promise<Result<null, string>> {

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
