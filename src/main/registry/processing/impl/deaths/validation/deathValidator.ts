import { DeathRecord, ValidationResult } from '@app/api';
import { checkIsAnimalAlreadyDead } from './rules/checkIsAnimalAlreadyDead';
import {Database} from "@database/async";
import {checkDateFormat} from "../../../helpers/validators/dateValidator";
import {checkUUIDv4} from "../../../helpers/validators/uuidv4Validator";

export async function validateDeathRows(
  db: Database, 
  deathRecord: DeathRecord
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let index = 0; index < deathRecord.deaths.length; index++) {
    const row = deathRecord.deaths[index];
    const errors: string[] = [];

    let isDeadCheck = await checkIsAnimalAlreadyDead(db, row);
    errors.push(...isDeadCheck.errors);

    let isValidDeathDateCheck = checkDateFormat(row.deathDate);
    errors.push(...isValidDeathDateCheck.errors);

    let isValidUUIDv4 = checkUUIDv4(row.animalId);
    errors.push(...isValidUUIDv4.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
