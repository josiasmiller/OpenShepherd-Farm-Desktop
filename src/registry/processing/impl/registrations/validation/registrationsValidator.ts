import { RegistryRow, ValidationResult } from '../../../core/types';
import { checkHasOfficialId } from './rules/checkHasOfficialId.js';

import { Species } from '../../../../../database/index.js';


export async function validateRegistrationRows(rows: RegistryRow[], species: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const officialCheck = await checkHasOfficialId(row, species);
    errors.push(...officialCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
