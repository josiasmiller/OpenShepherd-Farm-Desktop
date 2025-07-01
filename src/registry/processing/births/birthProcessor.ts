import { RegistryRow, ProcessingResult } from '../core/types';

import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../database/dbUtils';

export class BirthProcessor {
  async process(rows: RegistryRow[]): Promise<ProcessingResult> {
    try {
      // await beginTransaction(); //we dont want to start transactions *quite* yet until the validatio npart is complete

      for (const row of rows) {
        console.log("working on row:")
        console.log(row);
      }

      // await commitTransaction();
      return { success: true, insertedRowCount: rows.length } as ProcessingResult;

    } catch (error) {
      // await rollbackTransaction();
      return { success: false, error: (error as Error).message } as ProcessingResult;
    }
  }
}
