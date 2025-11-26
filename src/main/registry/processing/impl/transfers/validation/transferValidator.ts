import type { ValidationResult, TransferRecord, AnimalRow } from '@app/api';
import { checkHasOfficialId } from './rules/checkHasOfficialId';
import {Database} from "sqlite3";

/**
 * validates the data extracted from a registration CSV
 * @param db The Database to act on
 * @param transferRecord the transfer data being validated
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateTransferRows(db: Database, transferRecord: TransferRecord): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  let rows : AnimalRow[] = transferRecord.animals;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const federalCheck = await checkHasOfficialId(db, row);
    errors.push(...federalCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
