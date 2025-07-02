import { RegistryRow, ValidationResult } from '../../core/types';
import { checkSireAlive } from './rules/checkSireAlive.js';

export class BirthValidator {
  async validate(rows: RegistryRow[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const errors: string[] = [];

      // Run all relevant checks
      const sireCheck = await checkSireAlive(row);
      errors.push(...sireCheck.errors);

      // Future checks to be added here
      // const anotherCheck = await checkOtherRule(row);
      // errors.push(...anotherCheck.errors);

      results.push({
        rowIndex: index,
        isValid: errors.length === 0,
        errors,
      });
    }

    return results;
  }
}
