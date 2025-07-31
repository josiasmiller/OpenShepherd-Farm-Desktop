import { RegistryRow, ValidationResult } from '../../../core/types.js';
import { Species } from '../../../../../database/index.js';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead.js';


export async function validateDeathRows(rows: RegistryRow[], _: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    var isDeadCheck = await checkIsAnimalAlreadyDead(row);
    errors.push(...isDeadCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
