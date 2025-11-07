import { RegistryRow, Species, ValidationResult, ParseResult } from '@app/api';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead';
import {Database} from "sqlite3";

export async function validateDeathRows(
  db: Database, 
  sections: Record<string, RegistryRow[]>, 
  _: Species, 
  parseResult: ParseResult<any>,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  var rows : RegistryRow[] = sections.death_records;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    var isDeadCheck = await checkIsAnimalAlreadyDead(db, row);
    errors.push(...isDeadCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
