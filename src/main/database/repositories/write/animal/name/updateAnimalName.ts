import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "packages/core";

/**
 * Updates the animal_name and modified timestamp for a given animal ID.
 *
 * @param animalId UUID of the animal
 * @param newName New name to assign to the animal
 * @returns A `Result` containing `null` on success, 
 *          or a string error message on failure.
 */
export async function updateAnimalName(
  animalId: string,
  newName: string
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    UPDATE animal_table
    SET animal_name = ?,
        modified = datetime('now')
    WHERE id_animalid = ?
  `;

  const values = [newName, animalId];

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
