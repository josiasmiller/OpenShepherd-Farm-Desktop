import { handleResult } from 'packages/core';
import { Species, RegistryRow, ProcessingResult } from 'packages/api';


// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processTransferRows(sections: Record<string, RegistryRow[]>, _: Species): Promise<ProcessingResult> {


  // PLACEHOLDER --> this will be removed when the processing code is implemented:
  return {
    success: true,
    insertedRowCount: 0,
    errors: ["Transfer Processing has not yet been implemented"],
  };

  try {
    await beginTransaction();

    var rows : RegistryRow[] = [];

    for (const row of rows) {
      try {

        // TODO --> implement processing functionality

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.animalName}": ${(innerError as Error).message}`);
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
