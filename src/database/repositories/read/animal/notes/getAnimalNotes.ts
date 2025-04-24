import { getDatabase } from "../../../../dbConnections.js";
import { AnimalNote } from "../../../../models/read/animal/notes/animalNote.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

export const getAnimalNotes = async (animalId : string): Promise<Result<AnimalNote[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let noteQuery = `
    SELECT
        an.id_animalnoteid,
        a.animal_name,
        flock_prefix_table.flock_prefix,
        an.note_text,
        pn.predefined_note_text,
        an.note_date,
        an.note_time
    FROM animal_note_table an
    JOIN animal_table a ON an.id_animalid = a.id_animalid
    LEFT JOIN predefined_notes_table pn ON an.id_predefinednotesid = pn.id_predefinednotesid

    -- Join to get flock prefix
    JOIN animal_flock_prefix_table afp ON afp.id_animalid = a.id_animalid
    JOIN flock_prefix_table ON flock_prefix_table.id_flockprefixid = afp.id_flockprefixid

    WHERE an.id_animalid = ?;
  `;


  return new Promise((resolve, reject) => {
    db.all(noteQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: AnimalNote[] = rows.map((row: any) => ({
          id: row.id,
          flockPrefix: row.flock_prefix,
          animalName: row.animal_name,
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