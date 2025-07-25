import { getDatabase } from "../../../../dbConnections.js";
import { getSQLiteDateStringNow } from "../../../../dbUtils.js";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { Owner } from "../../../../models/read/owners/owner.js";
import { OwnerType } from "../../../../client-types.js";
import { NATURAL_ADDITION } from "../../../../dbConstants.js";

/**
 * Inserts a birth ownership record for an animal.
 * 
 * @param animalId - The animal's UUID
 * @param owner - The owner object (contact or company)
 * @param transferDate - The transfer date in YYYY-MM-DD format
 * @returns Result with inserted ownership record ID or error message
 */
export async function insertBirthOwnershipRecord(
  animalId: string,
  owner: Owner,
  transferDate: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const idAnimalOwnershipHistoryId = uuidv4();
  const created = getSQLiteDateStringNow();
  const modified = created;

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
          NATURAL_ADDITION,
          created,
          modified
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
