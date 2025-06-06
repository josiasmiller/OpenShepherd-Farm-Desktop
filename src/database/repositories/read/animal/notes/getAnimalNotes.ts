import { getDatabase } from "../../../../dbConnections";
import { AnimalNote } from "../../../../models/read/animal/notes/animalNote";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes";

export const getAnimalNotes = async (animalId : string): Promise<Result<AnimalNote[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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