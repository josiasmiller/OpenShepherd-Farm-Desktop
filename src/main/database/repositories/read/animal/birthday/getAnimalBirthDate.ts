import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { getDbDate } from "../../../../dbUtils";

/**
 * gets the birthdate of an animal
 * @param db Database to act on
 * @param animalId UUID of animal 
 * @returns A `Result` containing a `Date` object on success, 
 *          or a string error message on failure.
 */
export const getAnimalBirthDate = async (db: Database, animalId: string): Promise<Result<Date, string>> => {

  const query = `
    SELECT a.birth_date
    FROM animal_table a
    WHERE a.id_animalid = ?;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(`DB error while retrieving birth date for animal ${animalId}: ${err.message}`));
        return;
      }

      const row = rows[0] as { birth_date: string | null } | undefined;

      if (!row || !row.birth_date) {
        resolve(new Failure(`No birth date found for animal ${animalId}`));
        return;
      }

      const birthDate = getDbDate(row.birth_date);
      if (!birthDate) {
        resolve(new Failure(`Could not parse birth date for animal ${animalId}: ${row.birth_date}`));
        return;
      }

      resolve(new Success(birthDate));
    });
  });
};
