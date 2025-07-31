import { RegistryRow, ProcessingResult } from '../../../core/types';
import { handleResult } from '../../../../../shared/results/resultTypes.js';


// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils.js';

// DB types
import {
  Species,
} from '../../../../../database/index.js';

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processDeathRows(rows: RegistryRow[], _ : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    for (const row of rows) {
      try {


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
