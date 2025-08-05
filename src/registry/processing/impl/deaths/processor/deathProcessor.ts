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
  deleteAnimalAlerts,
  deleteAnimalAtStudEntriesWithoutFrozenSemen,
  deleteAnimalForSaleEntry,
  insertAnimalNote,
  markAnimalDeathLocation,
  Species,
  updateAnimalDeath,
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

        const animalId : string = row.animalId;
        const deathReasonId : string = row.reasonKey;
        const deathDate : string = row.deathDate;
        const animalNote : string | null = row.notes ?? null;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update death record of animal

        var animalDeathResult = await updateAnimalDeath(
          animalId,
          deathDate,
          deathReasonId,
        );

        await handleResult(animalDeathResult, {
          success: (_: void) => {
            // do nothing
          },
          error: (err: string) => {
            console.error("Failed to update animal's death date:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update last location of animal

        var deathLocationResult = await markAnimalDeathLocation(
          animalId,
          deathDate,
        );

        await handleResult(deathLocationResult, {
          success: (_: void) => {
            // do nothing
          },
          error: (err: string) => {
            console.error("Failed to update animal's death location:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add animal note if it there is one

        if (animalNote != null) {
          await _writeAnimalNote(animalId, animalNote, deathDate);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // delete any pertinent data that needs to be on animal death
        var deleteAnimalAlertResult = await deleteAnimalAlerts(animalId);

        await handleResult(deleteAnimalAlertResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            console.error("Failed to delete from animal alert table:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var deleteAnimalAtStudResult = await deleteAnimalAtStudEntriesWithoutFrozenSemen(animalId);

        await handleResult(deleteAnimalAtStudResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            console.error("Failed to delete from animal at stud table:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var deleteAnimalForSaleResult = await deleteAnimalForSaleEntry(animalId);

        await handleResult(deleteAnimalForSaleResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            console.error("Failed to delete from animal for sale table:", err);
            throw new Error(err);
          },
        });

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.name}": ${(innerError as Error).message}`);
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

async function _writeAnimalNote(animalId : string, animalNote: string, noteDate: string) {
  var noteResult = await insertAnimalNote(
    animalId,
    animalNote,
    noteDate,
  );

  await handleResult(noteResult, {
    success: (_: string) => {
      // do nothing since we do not care about he new note's ID
    },
    error: (err: string) => {
      console.error("Failed to write animal death note:", err);
      throw new Error(err);
    },
  });
}
