import { RegistryRow, ProcessingResult } from '../../core/types';
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../database/dbUtils.js';

import { 
  InsertAnimalTableInput,
  insertIntoAnimalTable
} from '../../../../database/index.js';

import { mapRegistryRowToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput.js';


export async function processBirthRows(rows: RegistryRow[]): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    for (const row of rows) {
      try {

        var animalTableInput : InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);
        await insertIntoAnimalTable(animalTableInput);

        // will be adding more insert statements here

      } catch (innerError) {
        throw new Error(`Failed processing row with animalId "${row.animalId}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction();
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction();
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}
