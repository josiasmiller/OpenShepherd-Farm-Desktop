import { RegistryRow, Species, ValidationResult } from '@app/api';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead';
import {Database} from "@database/async";

export async function validateDeathRows(
  db: Database, 
  sections: Record<string, RegistryRow[]>, 
  _: Species, 
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  var rows : RegistryRow[] = sections.death_records;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    var isDeadCheck = await checkIsAnimalAlreadyDead(db.raw(), row);
    errors.push(...isDeadCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
