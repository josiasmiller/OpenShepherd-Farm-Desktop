import { RegistryRow, ValidationResult } from '../../../core/types';
import { checkSireAlive } from './rules/checkSireAlive';
import { checkSireBreedingAge } from './rules/checkSireBreedingAge';
import { checkDamBreedingAge } from './rules/checkDamBreedingAge';
import { checkDamRecentOffspring } from './rules/checkDamRecentOffspring';
import { Species } from '../../../../../database';


export async function validateBirthRows(rows: RegistryRow[], species: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const sireCheck = await checkSireAlive(row, species);
    errors.push(...sireCheck.errors);

    const sireAgeCheck = await checkSireBreedingAge(row, species);
    errors.push(...sireAgeCheck.errors);

    const damAgeCheck = await checkDamBreedingAge(row, species);
    errors.push(...damAgeCheck.errors);

    const damRecentOffspringCheck = await checkDamRecentOffspring(row, species);
    errors.push(...damRecentOffspringCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
