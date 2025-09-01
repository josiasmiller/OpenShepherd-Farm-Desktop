import type { PedigreeNode, Species, RegistryRow, ValidationResult } from 'packages/api';
import { checkHasFederalId } from './rules/checkHasFederalId';


/**
 * validates the data extracted from a registration CSV
 * @param rows rows to be processed
 * @param _ here only to satisfy interface
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateTransferRows(sections: Record<string, RegistryRow[]>, _: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  var rows : RegistryRow[] = sections.transferred_animals;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const federalCheck = await checkHasFederalId(row);
    errors.push(...federalCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
