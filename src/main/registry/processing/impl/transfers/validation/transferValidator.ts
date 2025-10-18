import type { Species, RegistryRow, ValidationResult } from 'packages/api';
import { checkHasOfficialId } from './rules/checkHasOfficialId';
import {Database} from "sqlite3";


/**
 * validates the data extracted from a registration CSV
 * @param db The Database to act on
 * @param rows rows to be processed
 * @param _ here only to satisfy interface
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateTransferRows(db: Database, sections: Record<string, RegistryRow[]>, _: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  var rows : RegistryRow[] = sections.transferred_animals;

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
