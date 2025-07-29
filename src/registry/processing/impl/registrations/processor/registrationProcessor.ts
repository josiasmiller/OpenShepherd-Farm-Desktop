import { RegistryRow, ProcessingResult } from '../../../core/types';
import { getSelectedDefault } from '../../../../../main/store/selectedDefaultStore.js';
// import { handleResult, Result } from '../../../../../shared/results/resultTypes.js';

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils.js';

// DB types
import {
  DefaultSettingsResults,
  Species,
} from '../../../../../database/index.js';


export async function processRegistrationRows(rows: RegistryRow[], species : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    var selectedDefault : DefaultSettingsResults | null = getSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Settings is Set");
    }

    for (const row of rows) {
      try {

        // TODO --> implement process functionality

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

