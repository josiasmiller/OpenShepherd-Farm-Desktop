import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { Owner, OwnerType } from "packages/api";
import { dateAsString, dateTimeAsString } from "../../../dbUtils";

/**
 * Inserts a row into animal_registration_table for a registered animal,
 * but only if an identical registration doesn't already exist.
 * @param breeder breeder of the animal
 * @param animalId UUID of animal
 * @param animalName string name of animal
 * @param registrationNumber registration number of animal
 * @param registrationCompanyId which company UUID to mark in `id_registry_company_id`
 * @param flockBookId the flock book UUID to mark in the database
 * @param registrationTypeId the UUID of the registration type
 */
export async function insertAnimalRegistrationRow(
  breeder: Owner,
  animalId: string,
  animalName: string,
  registrationNumber: string,
  registrationCompanyId: string,
  flockBookId: string,
  registrationTypeId: string,
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  // First check: does a matching registration already exist?
  const existingRow = await new Promise<any>((resolve, reject) => {
    db.get(
      `
      SELECT 1
      FROM animal_registration_table
      WHERE id_animalid = ?
        AND id_registry_id_companyid = ?
        AND id_animalregistrationtypeid = ?
      LIMIT 1
      `,
      [animalId, registrationCompanyId, registrationTypeId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });

  if (existingRow) {
    return new Failure(`A registration already exists for animalId=\'${animalId}\', id_registry_id_companyid=\'${registrationCompanyId}\', & id_animalregistrationtypeid=\'${registrationTypeId}\'.`);
  }

  // If not, proceed with insert
  const id = uuidv4();

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
  `;

  const today : String = dateAsString();
  const todayDt : String = dateTimeAsString();

  const values = [
    id,
    animalId,
    animalName,
    registrationNumber,
    registrationCompanyId,
    registrationTypeId,
    flockBookId,
    today,
    breeder.type === OwnerType.CONTACT ? breeder.contact.id : null,
    breeder.type === OwnerType.COMPANY ? breeder.company.id : null,
    todayDt,
    todayDt,
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
