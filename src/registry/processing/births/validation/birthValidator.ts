import { RegistryRow, ValidationResult } from '../../core/types';
import { checkSireAlive } from './rules/checkSireAlive.js';
import { checkSireBreedingAge } from './rules/checkSireBreedingAge.js';
import { checkDamBreedingAge } from './rules/checkDamBreedingAge.js';


export async function validateBirthRows(rows: RegistryRow[]): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const sireCheck = await checkSireAlive(row);
    errors.push(...sireCheck.errors);

    const sireAgeCheck = await checkSireBreedingAge(row);
    errors.push(...sireAgeCheck.errors);

    const damAgeCheck = await checkDamBreedingAge(row);
    errors.push(...damAgeCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
