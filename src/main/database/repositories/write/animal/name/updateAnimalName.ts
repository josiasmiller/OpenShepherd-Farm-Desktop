import {Database} from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";

/**
 * Updates the animal_name and modified timestamp for a given animal ID.
 *
 * @param db The Database to act on
 * @param animalId UUID of the animal
 * @param newName New name to assign to the animal
 * @returns A `Result` containing `null` on success, 
 *          or a string error message on failure.
 */
export async function updateAnimalName(
  db: Database,
  animalId: string,
  newName: string
): Promise<Result<null, string>> {

  const query = `
    UPDATE animal_table
    SET animal_name = ?,
        modified = ?
    WHERE id_animalid = ?
  `;

  const todayDt : String = dateTimeAsString();

  const values = [newName, todayDt, animalId];

  try {
    const changes = await new Promise<number>((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    if (changes === 0) {
      return new Failure(`No animal found with ID: ${animalId}`);
    }

    return new Success(null);
  } catch (err: any) {
    return new Failure(`Failed to update animal name: ${err.message}`);
  }
}
