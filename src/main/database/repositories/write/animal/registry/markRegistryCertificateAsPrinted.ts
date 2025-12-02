import { Database } from "@database/async";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";

/**
 * Updates the registry_certificate_print_table to set printed = 1
 * and updates the modified timestamp for the given animalId.
 * Returns Failure if no row was updated.
 *
 * @param db The Database to act on
 * @param certificatePrintId UUID of the DB row being altered
 */
export async function markRegistryCertificateAsPrinted(
    db: Database,
    certificatePrintId: string
): Promise<Result<null, string>> {

  const query = `
    UPDATE registry_certificate_print_table
    SET printed = 1,
        modified = ?
    WHERE id_registrycertificateprintid = ?
  `;

  const todayDt: string = dateTimeAsString();

  try {
    const result = await db.run(query, [todayDt, certificatePrintId]);

    if (result.changes === 0) {
      return new Failure(
          `No rows updated for certificatePrintId: ${certificatePrintId}`
      );
    }

    return new Success(null);

  } catch (err: any) {
    return new Failure(
        `Failed to update registry certificate print row: ${err.message}`
    );
  }
}
