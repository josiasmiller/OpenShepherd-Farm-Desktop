import { RegistryRow, ValidationResult } from '../core/types';

export class BirthValidator {
  async validate(rows: RegistryRow[]): Promise<ValidationResult[]> {
    return rows.map((row, index) => {
      const errors: string[] = [];

      // TODO: push errors here when performing checks
      // if (!row.birthdate) errors.push('Birthdate is required.');
      // if (row.sex !== 'M' && row.sex !== 'F') errors.push('Sex must be M or F.');

      console.log("VALIDATING!");

      return {
        rowIndex: index,
        isValid: errors.length === 0,
        errors,
      };
    });
  }
}
