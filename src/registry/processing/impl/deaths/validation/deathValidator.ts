import { RegistryRow, ValidationResult } from '../../../core/types';
import { Species } from '../../../../../database';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead';


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
