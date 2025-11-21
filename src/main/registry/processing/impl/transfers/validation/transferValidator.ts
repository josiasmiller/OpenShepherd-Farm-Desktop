import type { Species, RegistryRow, ValidationResult, ParseResult, TransferParseResponse, AnimalRow } from '@app/api';
import { checkHasOfficialId } from './rules/checkHasOfficialId';
import {Database} from "sqlite3";

/**
 * validates the data extracted from a registration CSV
 * @param db The Database to act on
 * @param _sections here only to satisfy interface
 * @param _species here only to satisfy interface
 * @returns ValidationResult indicating if the validation was successful or not
 */
export async function validateTransferRows(
  db: Database, 
  _sections: Record<string, RegistryRow[]>, 
  _species: Species, 
  parseResult: ParseResult<TransferParseResponse>,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  let rows : AnimalRow[] = parseResult.data.animals;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const errors: string[] = [];

    // Run all relevant checks
    const federalCheck = await checkHasOfficialId(db, row);
    errors.push(...federalCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
