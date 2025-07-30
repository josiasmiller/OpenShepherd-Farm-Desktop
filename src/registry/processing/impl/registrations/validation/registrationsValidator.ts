import { RegistryRow, ValidationResult } from '../../../core/types';
import { checkHasOfficialId } from './rules/checkHasOfficialId.js';

import { Species } from '../../../../../database/index.js';


/**
 * validates the data extracted from a registration CSV
 * @param rows rows to be processed
 * @param _ here only to satisfy interface
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateRegistrationRows(rows: RegistryRow[], _: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const officialCheck = await checkHasOfficialId(row);
    errors.push(...officialCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
