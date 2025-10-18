import {Database} from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "packages/core";
import { v4 as uuidv4 } from 'uuid';

/**
 * Writes a new row to the registry_certificate_print_table
 * and updates the modified timestamp for the given animalId.
 * Returns Failure if no row was updated.
 *
 * @param db The Database to act on
 * @param animalId UUID of the animal
 * @param companyId UUID of the company
 * @param registrationTypeId UUID of the registration type
 */
export async function insertNewRegistryCertificateRow(
  db: Database,
  animalId: string,
  companyId: string,
  registrationTypeId: string,
): Promise<Result<null, string>> {

  const query = `
    INSERT INTO registry_certificate_print_table (
      id_registrycertificateprintid,
      id_companyid,
      id_animalid,
      id_registrationtypeid,
      printed,
      created,
      modified
    ) VALUES (
      ?, ?, ?, ?, 0, ?, ?
    );
  `;

  const todayDt : string = dateTimeAsString();
  const id = uuidv4();

  let values : string[] = [
    id,
    companyId,
    animalId,
    registrationTypeId,
    todayDt,
    todayDt,
  ];

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
