import { Species, RegistryRow, ValidationResult, ParseResult } from '@app/api';
import { checkHasOfficialId } from './rules/checkHasOfficialId';
import {Database} from "sqlite3";

/**
 * validates the data extracted from a registration CSV
 *
 * @param db The Database to act on
 * @param rows rows to be processed
 * @param _ here only to satisfy interface
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateRegistrationRows(db: Database, sections: Record<string, RegistryRow[]>, _: Species, parseResult: ParseResult<any>,): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  var rows : RegistryRow[] = sections.registration_records;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const officialCheck = await checkHasOfficialId(db, row);
    errors.push(...officialCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
