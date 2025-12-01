import {Database} from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";

/**
 * Updates the registry_certificate_print_table to set printed = 1
 * and updates the modified timestamp for the given animalId.
 * Returns Failure if no row was updated.
 *
 * @param db The Database to act on
 * @param rowId UUID of the row being altered
 */
export async function markRegistryCertificateAsPrinted(
  db: Database, rowId: string
): Promise<Result<null, string>> {

  const query = `
    UPDATE registry_certificate_print_table
    SET printed = 1,
        modified = ?
    WHERE id_registrycertificateprintid = ?
  `;

  const todayDt : String = dateTimeAsString();

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, [todayDt, rowId], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error(`No rows updated for rowId: ${rowId}`));
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
