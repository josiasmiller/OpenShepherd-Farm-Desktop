import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { AnimalNote } from "packages/api";

/**
 * gets all animal notes for a given animal
 * @param db The Database to act on
 * @param animalId UUID of animal being sought
 * @returns A `Result` containing an array of `AnimalNote` objects on success, 
 *          or a string error message on failure.
 */
export const getAnimalNotes = async (db: Database, animalId : string): Promise<Result<AnimalNote[], string>> => {

  let noteQuery = `
    SELECT
        an.id_animalnoteid,
        an.note_text,
        pn.predefined_note_text,
        an.note_date,
        an.note_time
    FROM animal_note_table an
    LEFT JOIN predefined_notes_table pn ON an.id_predefinednotesid = pn.id_predefinednotesid
    WHERE an.id_animalid = ?;
  `;


  return new Promise((resolve, reject) => {
    db.all(noteQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: AnimalNote[] = rows.map((row: any) => ({
          noteId: row.id,
          animalId: animalId,
          noteText: row.note_text,
          predefinedNote: row.predefined_note_text,
          noteDate: row.note_date,
          noteTime: row.note_time,
        }));

        resolve(new Success(results));
      }
    });
  });
};