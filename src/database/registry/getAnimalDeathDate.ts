import { getDatabase } from "../dbConnections.js";
import { Result, Success, Failure } from "../../shared/results/resultTypes.js";

type AnimalDeathDate = {
  animalId: string;
  deathDate: string | null;
};

type AnimalDeathDateRow = {
  death_date: string;
}

export const getAnimalDeathDate = async (
  animalId: string
): Promise<Result<AnimalDeathDate, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB Instance is null");
  }

  const query = `
    SELECT death_date
    FROM animal_table
    WHERE id_animalid = ?
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], (err, row: AnimalDeathDateRow) => {
      if (err) {
        resolve(new Failure(`Error retrieving animal death date: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`Animal with ID ${animalId} not found`));
      } else {
        resolve(new Success({
          animalId,
          deathDate: row.death_date ?? null,
        }));
      }
    });
  });
};
