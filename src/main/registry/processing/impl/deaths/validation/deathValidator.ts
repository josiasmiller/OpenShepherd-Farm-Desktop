import { DeathRecord, ValidationResult } from '@app/api';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead';
import {Database} from "@database/async";

export async function validateDeathRows(
  db: Database, 
  deathRecord: DeathRecord
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < deathRecord.deaths.length; index++) {
    const row = deathRecord.deaths[index];
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
