import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";
import { OwnerType } from "../../../client-types.js";
import { Owner } from "../../../models/read/owners/owner.js";
import { getSQLiteDateStringNow } from "../../../dbUtils.js";
import { REGISTRATION_BIRTH_NOTIFY } from "../../../dbConstants.js";

/**
 * Inserts a row into animal_registration_table for a registered animal.
 */
export async function insertAnimalRegistrationRow(
  breeder: Owner,
  animalId: string,
  animalName: string,
  registrationNumber: string,
  registrationDate: string,
  registrationCompanyId: string,
  flockBookId: string,
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const id = uuidv4();
  const created = getSQLiteDateStringNow();
  const modified = created;

  const query = `
    INSERT INTO animal_registration_table (
      id_animalregistrationid,
      id_animalid,
      animal_name,
      registration_number,
      id_registry_id_companyid,
      id_animalregistrationtypeid,
      id_flockbookid,
      registration_date,
      registration_description,
      id_breeder_id_contactid,
      id_breeder_id_companyid,
      created,
      modified
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?)
  `; // the NULL here is on the registration_description

  const values = [
    id,
    animalId,
    animalName,
    registrationNumber,
    registrationCompanyId,
    REGISTRATION_BIRTH_NOTIFY,
    flockBookId,
    registrationDate,
    breeder.type === OwnerType.CONTACT ? breeder.contact.id : null,
    breeder.type === OwnerType.COMPANY ? breeder.company.id : null,
    created,
    modified,
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    return new Success(null);
  } catch (err: any) {
    return new Failure(`Failed to insert animal registration row: ${err.message}`);
  }
}
