import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

/**
 * Retrieves the current_id_flockbookid from registry_default_settings_table
 * based on the given registry company ID.
 *
 * @param db The Database to act on
 * @param companyId : the registry company ID to search for
 */
export async function getDefaultFlockBookId(
  db: Database, companyId: string
): Promise<Result<string, string>> {

  const query = `
    SELECT current_id_flockbookid
    FROM registry_default_settings_table
    WHERE id_companyid = ?
  `;

  try {
    const row = await new Promise<{ current_id_flockbookid: string } | undefined>((resolve, reject) => {
      db.get(query, [companyId], (err, row) => {
        if (err) reject(err);
        else resolve(row as { current_id_flockbookid: string } | undefined);
      });
    });

    if (!row) {
      return new Failure(`No default flock book found for company ID: ${companyId}`);
    }

    return new Success(row.current_id_flockbookid);
  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}
