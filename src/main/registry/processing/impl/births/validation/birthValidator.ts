import { RegistryRow, Species, ValidationResult } from 'packages/api';
import { checkSireAlive } from './rules/checkSireAlive';
import { checkSireBreedingAge } from './rules/checkSireBreedingAge';
import { checkDamBreedingAge } from './rules/checkDamBreedingAge';
import { checkDamRecentOffspring } from './rules/checkDamRecentOffspring';
import { checkHasAtLeastOneValidTag } from './rules/checkHasAtLeastOneValidTag';
import { checkElectronicTags } from './rules/checkElectronicTags';
import {Database} from "sqlite3";

export async function validateBirthRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  var rows : RegistryRow[] = sections.birth_records;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const tagCheck = await checkElectronicTags(db, row);
    errors.push(...tagCheck.errors);

    const atLeastOneValidTagCheck = await checkHasAtLeastOneValidTag(row);
    errors.push(...atLeastOneValidTagCheck.errors)

    const sireCheck = await checkSireAlive(db, row, species);
    errors.push(...sireCheck.errors);

    const sireAgeCheck = await checkSireBreedingAge(db, row, species);
    errors.push(...sireAgeCheck.errors);

    const damAgeCheck = await checkDamBreedingAge(db, row, species);
    errors.push(...damAgeCheck.errors);

    const damRecentOffspringCheck = await checkDamRecentOffspring(db, row, species);
    errors.push(...damRecentOffspringCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
