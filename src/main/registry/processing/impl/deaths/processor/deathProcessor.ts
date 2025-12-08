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
  endAnimalLeaseFromDeath,
  endMaleBreedingFromDeath,
} from '../../../../../database';
import {Database} from '@database/async';
import log from 'electron-log';

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param db The Database to act on
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processDeathRows(db: Database, sections: Record<string, RegistryRow[]>, _ : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction(db.raw());

    let rows : RegistryRow[] = sections.death_records;

    for (const row of rows) {
      try {

        const animalId : string = row.animalId;
        const deathReasonId : string = row.reasonKey;
        const deathDate : string = row.deathDate;
        const animalNote: string | null = row.notes?.trim() ? row.notes : null; // only gets a string if not null & not empty str

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update death record of animal

        let animalDeathResult = await updateAnimalDeath(
          db.raw(),
          animalId,
          deathDate,
          deathReasonId,
        );

        await handleResult(animalDeathResult, {
          success: (_: void) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to update animal's death date:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update last location of animal

        let deathLocationResult = await markAnimalDeathLocation(
          db.raw(),
          animalId,
          deathDate,
        );

        await handleResult(deathLocationResult, {
          success: (_: void) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to update animal's death location:", err);
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
        let deleteAnimalAlertResult = await deleteAnimalAlerts(db.raw(), animalId);

        await handleResult(deleteAnimalAlertResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to delete from animal alert table:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // remove from animal at stud table

        let deleteAnimalAtStudResult = await deleteAnimalAtStudEntriesWithoutFrozenSemen(db.raw(), animalId);

        await handleResult(deleteAnimalAtStudResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to delete from animal at stud table:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Remove from animal for sale table

        let deleteAnimalForSaleResult = await deleteAnimalForSaleEntry(db.raw(), animalId);

        await handleResult(deleteAnimalForSaleResult, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to delete from animal for sale table:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // end any breeding leases
        let animalEndBreedingLeases = await endAnimalLeaseFromDeath(db, animalId, deathDate);

        await handleResult(animalEndBreedingLeases, {
          success: (_: void) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to update animal leases:", err);
            throw new Error(err);
          },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // end any male stud records
        let animalEndMaleBreeding = await endMaleBreedingFromDeath(db, animalId, deathDate, "08:00:00"); // for now just assume 8 o'clock until JSON parsing is updated and we can get the time

        await handleResult(animalEndMaleBreeding, {
          success: (_: null) => {
            // do nothing
          },
          error: (err: string) => {
            log.error("Failed to update male breeding table:", err);
            throw new Error(err);
          },
        });

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.name}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction(db.raw());
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction(db.raw());
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

async function _writeAnimalNote(db: Database, animalId : string, animalNote: string, noteDate: string) {
  let noteResult = await insertAnimalNote(
    db.raw(),
    animalId,
    animalNote,
    noteDate,
  );

  await handleResult(noteResult, {
    success: (_: string) => {
      // do nothing since we do not care about he new note's ID
    },
    error: (err: string) => {
      log.error("Failed to write animal death note:", err);
      throw new Error(err);
    },
  });
}
