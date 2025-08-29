import type { PedigreeNode, Species, RegistryRow, ValidationResult } from 'packages/api';
import { checkHasFederalId } from './rules/checkHasFederalId';

import { getPedigree } from '../../../../../database';
import { verifyCoatColorAccuracy } from './rules/coatColorSanityCheck';

import { handleResult } from "packages/core";


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

    const animalId : string = row.animalId;
    let pedigreeResult = await getPedigree(animalId, 1);
    let baseNode : PedigreeNode
    await handleResult(pedigreeResult, {
      success: (pn: PedigreeNode) => {
        baseNode = pn;
      },
      error: (err) => {
        throw new Error(`Failed to get pedigreeNode for animalId=${animalId}: ${err}`);
      },
    });

    baseNode = baseNode!;
    
    const sireId : string = baseNode.sirePedigree.animalId;
    const damId : string = baseNode.damPedigree.animalId;

    // Run all relevant checks
    const federalCheck = await checkHasFederalId(row);
    errors.push(...federalCheck.errors);

    const coatColorCheck = await verifyCoatColorAccuracy(
      sireId,
      damId,
      animalId,
    );
    errors.push(...coatColorCheck.errors);

    results.push({
      rowIndex: index,
      isValid: errors.length === 0,
      errors,
    });
  }

  return results;
}
