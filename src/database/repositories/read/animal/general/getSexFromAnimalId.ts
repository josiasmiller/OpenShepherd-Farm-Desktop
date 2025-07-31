import { getDatabase } from "../../../../dbConnections.js";
import { Sex } from "../../../../models/read/animal/general/sex.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

type SexRow = {
  id: string;
  name: string;
  display_order: number;
  species_id: string | null;
};

/**
 * gets the sex of a given animal
 * @param animalId UUID of the animal being sought
 * @returns A `Result` containing a `Sex` object on success, 
 *          or a string error message on failure.
 */
export const getSexFromAnimalId = async (animalId: string): Promise<Result<Sex, string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const sexQuery = `
    SELECT 
      s.id_sexid AS id, 
      s.sex_name AS name,
      s.sex_display_order AS display_order,
      s.id_speciesid AS species_id
    FROM animal_table a
    JOIN sex_table s ON a.id_sexid = s.id_sexid
    WHERE a.id_animalid = ?
  `;

  return new Promise((resolve, reject) => {
    db.get<SexRow>(sexQuery, [animalId], (err, row) => {
      if (err) {
        reject(new Failure(err.message));
      } else if (!row) {
        resolve(new Failure(`No sex found for animal ID: ${animalId}`));
      } else {
        const result: Sex = {
          id: row.id,
          name: row.name,
          display_order: row.display_order,
          species_id: row.species_id,
        };
        resolve(new Success(result));
      }
    });
  });
};
