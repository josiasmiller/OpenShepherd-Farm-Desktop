import {BirthRecord, BirthNotification, Species, ValidationResult} from '@app/api';
import { checkSireAlive } from './rules/checkSireAlive';
import { checkSireBreedingAge } from './rules/checkSireBreedingAge';
import { checkDamBreedingAge } from './rules/checkDamBreedingAge';
import { checkDamRecentOffspring } from './rules/checkDamRecentOffspring';
import { checkHasAtLeastOneValidTag } from './rules/checkHasAtLeastOneValidTag';
import { checkElectronicTags } from './rules/checkElectronicTags';
import {Database} from "@database/async";

export async function validateBirthRows(db: Database, birthRecord: BirthRecord, species: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  let rows : BirthNotification[] = birthRecord.rows;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    const electronicTagCheck = await checkElectronicTags(row);
    errors.push(...electronicTagCheck.errors);

    // do not check stillborn tags
    if (!row.isStillborn) {
      const atLeastOneValidTagCheck = await checkHasAtLeastOneValidTag(row);
      errors.push(...atLeastOneValidTagCheck.errors)
    }

    const sireCheck = await checkSireAlive(db.raw(), row, species);
    errors.push(...sireCheck.errors);

    const sireAgeCheck = await checkSireBreedingAge(db.raw(), row, species);
    errors.push(...sireAgeCheck.errors);

    const damAgeCheck = await checkDamBreedingAge(db.raw(), row, species);
    errors.push(...damAgeCheck.errors);

    const damRecentOffspringCheck = await checkDamRecentOffspring(db.raw(), row, species);
    errors.push(...damRecentOffspringCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
