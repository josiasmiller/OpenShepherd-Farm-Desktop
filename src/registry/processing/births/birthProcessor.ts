import { RegistryRow, ProcessingResult } from '../core/types';

// import {
//   beginTransaction,
//   commitTransaction,
//   rollbackTransaction
// } from '../../../database/dbUtils.js';

export async function processBirthRows(rows: RegistryRow[]): Promise<ProcessingResult> {
  try {
    // await beginTransaction();

    for (const row of rows) {
      // console.log("Processing row:");
      // console.log(row);
      // TODO: insert logic goes here
    }

    // await commitTransaction();
    return { success: true, insertedRowCount: rows.length };

  } catch (error) {
    // await rollbackTransaction();
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
