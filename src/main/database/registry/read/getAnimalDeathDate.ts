import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";

export type AnimalDeathDate = {
  animalId: string;
  deathDate: string | null;
};

type AnimalDeathDateRow = {
  death_date: string;
}

export const getAnimalDeathDate = async (
  db: Database, animalId: string
): Promise<Result<AnimalDeathDate, string>> => {

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
