import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";
import { getSQLiteDateStringNow } from "../../../../dbUtils";

/**
 * Updates the registry_certificate_print_table to set printed = 1
 * and updates the modified timestamp for the given animalId.
 * Returns Failure if no row was updated.
 * 
 * @param animalId UUID of the animal
 */
export async function markRegistryCertificateAsPrinted(
  animalId: string
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const modified = getSQLiteDateStringNow();

  const query = `
    UPDATE registry_certificate_print_table
    SET printed = 1,
        modified = ?
    WHERE id_animalid = ?
  `;

  const values = [modified, animalId];

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`No rows updated for animalId: ${animalId}`));
        } else {
          resolve();
        }
      });
    });

    return new Success(null);
  } catch (err: any) {
    return new Failure(`Failed to update registry certificate print row: ${err.message}`);
  }
}
