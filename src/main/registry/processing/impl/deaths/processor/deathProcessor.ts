import { handleResult } from '@common/core';
import { Species, RegistryRow, ProcessingResult } from '@app/api';


// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

// DB types
import {
  deleteAnimalAlerts,
  deleteAnimalAtStudEntriesWithoutFrozenSemen,
  deleteAnimalForSaleEntry,
  insertAnimalNote,
  markAnimalDeathLocation,
  updateAnimalDeath,
} from '../../../../../database';
import {Database} from "sqlite3";

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param db The Database to act on
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processDeathRows(db: Database, sections: Record<string, RegistryRow[]>, _ : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction(db);

    var rows : RegistryRow[] = sections.death_records;

    for (const row of rows) {
      try {

        const animalId : string = row.animalId;
        const deathReasonId : string = row.reasonKey;
        const deathDate : string = row.deathDate;
        const animalNote: string | null = row.notes?.trim() ? row.notes : null; // only gets a string if not null & not empty str

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update death record of animal

        var animalDeathResult = await updateAnimalDeath(
          db,
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
          db,
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
        // add animal note if it there is a valid one

        if (animalNote && animalNote.trim() !== "") {
          await _writeAnimalNote(db, animalId, animalNote, deathDate);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // delete any pertinent data that needs to be on animal death
        var deleteAnimalAlertResult = await deleteAnimalAlerts(db, animalId);

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

        var deleteAnimalAtStudResult = await deleteAnimalAtStudEntriesWithoutFrozenSemen(db, animalId);

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

        var deleteAnimalForSaleResult = await deleteAnimalForSaleEntry(db, animalId);

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

    await commitTransaction(db);
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction(db);
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

async function _writeAnimalNote(db: Database, animalId : string, animalNote: string, noteDate: string) {
  var noteResult = await insertAnimalNote(
    db,
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
