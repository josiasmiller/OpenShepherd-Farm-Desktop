import {Database} from "sqlite3";
import { Result, Success, Failure } from '@common/core';

/**
 * Deletes all entries from animal_at_stud_table for the given animal
 * where frozen_semen is not available (i.e., frozen_semen != 1).
 *
 * @param db - The Database to act on.
 * @param animalId - The ID of the animal.
 * @returns Result<null, string> indicating success or failure.
 */
export async function deleteAnimalAtStudEntriesWithoutFrozenSemen(
  db: Database, animalId: string
): Promise<Result<null, string>> {

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
