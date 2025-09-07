import { getDatabase } from '../../../../dbConnections';
import { getCurrentDateTime } from '../../../../dbUtils';
import { v4 as uuidv4 } from 'uuid';
import { Result, Success, Failure } from 'packages/core/src/resultTypes';


/**
 * Inserts a note into the animal_note_table for the given animal.
 *
 * @param animalId - The ID of the animal.
 * @param noteText - The text of the note to be inserted.
 * @param noteDate - The date of the note.
 * @returns Result<string, string> - The ID of the newly inserted note or a failure message.
 */
export async function insertAnimalNote(
  animalId: string,
  noteText: string,
  noteDate: string
): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const id = uuidv4();

  const query = `
    INSERT INTO animal_note_table (
      id_animalnoteid,
      id_animalid,
      note_text,
      note_date,
      note_time,
      id_predefinednotesid,
      created,
      modified
    ) VALUES (?, ?, ?, ?, "00:00:00", NULL, ?, ?)
  `;

  const todayDt : String = getCurrentDateTime();

  return new Promise<Result<string, string>>((resolve, reject) => {
    db.run(
      query,
      [id, animalId, noteText, noteDate, todayDt, todayDt,],
      (err: Error | null) => {
        if (err) {
          resolve(new Failure(`Failed to insert death note: ${err.message}`));
        } else {
          resolve(new Success(id));
        }
      }
    );
  });
}
