import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { getSQLiteDateStringNow } from "../../../../dbUtils.js";

/**
 * Updates the registry_certificate_print_table to set printed = 1
 * for the given animalId.
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

  const values = [animalId];

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) {
          reject(err);
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
