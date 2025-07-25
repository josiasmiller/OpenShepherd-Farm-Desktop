import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { getDbDate } from "../../../../dbUtils.js";

export const getAnimalBirthDate = async (animalId: string): Promise<Result<Date, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB instance is null");
  }

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
