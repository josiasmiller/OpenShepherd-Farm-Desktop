import { RegistryRow, ProcessingResult } from '../core/types';
import { BirthValidator } from './validation/birthValidator.js'; // Adjust the path if needed

import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../database/dbUtils';

export class BirthProcessor {
  async process(rows: RegistryRow[]): Promise<ProcessingResult> {
    try {
      const validator = new BirthValidator();
      const validationResults = await validator.validate(rows);

      const failed = validationResults.filter(result => !result.isValid);
      if (failed.length > 0) {
        return {
          success: false,
          error: "Validation failed for some rows.",
          validationErrors: failed, // <-- Optional: include for reporting in UI/logs
        } as ProcessingResult;
      }

      // Transactions would begin here once validation is fully integrated
      // await beginTransaction();

      for (const row of rows) {
        console.log("Processing row:");
        console.log(row);
        // TODO: insert logic goes here
      }

      // await commitTransaction();
      return { success: true, insertedRowCount: rows.length } as ProcessingResult;

    } catch (error) {
      // await rollbackTransaction();
      return {
        success: false,
        error: (error as Error).message,
      } as ProcessingResult;
    }
  }
}
