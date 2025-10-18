import {Database} from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { ID_TRANSFER_REASON_NATURAL_ADDITION } from "../../../../dbConstants";
import { Result, Success, Failure } from "packages/core";
import { Owner } from "packages/api";
import { OwnerType } from "packages/api";
import { v4 as uuidv4 } from "uuid";

/**
 * Inserts a birth ownership record for an animal.
 *
 * @param db The Database to act on
 * @param animalId - The animal's UUID
 * @param owner - The owner object (contact or company)
 * @param transferDate - The transfer date in YYYY-MM-DD format
 * @returns Result with inserted ownership record ID or error message
 */
export async function insertBirthOwnershipRecord(
  db: Database,
  animalId: string,
  owner: Owner,
  transferDate: string
): Promise<Result<string, string>> {

  const idAnimalOwnershipHistoryId = uuidv4();

  const query = `
    INSERT INTO animal_ownership_history_table (
      id_animalownershiphistoryid,
      id_animalid,
      transfer_date,
      from_id_contactid,
      from_id_companyid,
      to_id_contactid,
      to_id_companyid,
      id_transferreasonid,
      sale_price,
      sale_price_id_unitsid,
      created,
      modified
    )
    VALUES (?, ?, ?, NULL, NULL, ?, ?, ?, NULL, NULL, ?, ?)
  `;
  
  const todayDt : String = dateTimeAsString();

  const toContactId = owner.type === OwnerType.CONTACT ? owner.contact.id : null;
  const toCompanyId = owner.type === OwnerType.COMPANY ? owner.company.id : null;

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(
        query,
        [
          idAnimalOwnershipHistoryId,
          animalId,
          transferDate,
          toContactId,
          toCompanyId,
          ID_TRANSFER_REASON_NATURAL_ADDITION,
          todayDt,
          todayDt,
        ],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return new Success(idAnimalOwnershipHistoryId);
  } catch (err: any) {
    return new Failure(`Failed to insert birth ownership record: ${err.message}`);
  }
}
