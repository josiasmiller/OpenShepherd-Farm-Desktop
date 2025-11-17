import {Database} from "sqlite3";
import { Owner, OwnerType } from "@app/api";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from "@common/core";
import { dateTimeAsString } from "../../../../dbUtils";

/**
 * Inserts a birth ownership record for an animal.
 *
 * @param db           - The Database to act on
 * @param animalId     - The animal's UUID
 * @param fromOwner    - The owner who sells the animal (contact or company)
 * @param toOwner      - The owner who recieves the animal (contact or company)
 * @param transferDate - The transfer date in YYYY-MM-DD format
 * @returns Result with inserted ownership record ID or error message
 */
export async function insertTransferOfOwnershipRecord(
  db: Database,
  animalId: string,
  fromOwner: Owner,
  toOwner: Owner,
  transferDate: string,
  transferReasonId: string,
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
  `;

  const todayDt : string = dateTimeAsString();

  const fromContactId = fromOwner.type === OwnerType.CONTACT ? fromOwner.contact.id : null;
  const fromCompanyId = fromOwner.type === OwnerType.COMPANY ? fromOwner.company.id : null;

  const toContactId = toOwner.type === OwnerType.CONTACT ? toOwner.contact.id : null;
  const toCompanyId = toOwner.type === OwnerType.COMPANY ? toOwner.company.id : null;

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(
        query,
        [
          idAnimalOwnershipHistoryId,
          animalId,
          transferDate,
          fromContactId,
          fromCompanyId,
          toContactId,
          toCompanyId,
          transferReasonId,
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
