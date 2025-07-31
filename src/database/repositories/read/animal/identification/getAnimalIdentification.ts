import { getDatabase } from "../../../../dbConnections.js";
import { AnimalIdentification } from "../../../../models/read/animal/identification/animalIdentification.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { getDbDate } from "../../../../dbUtils.js";

export const getAnimalIdentification = async (animalId : string): Promise<Result<AnimalIdentification, string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let identificationQuery = `
    SELECT
      flock_prefix_table.flock_prefix,
      a.animal_name,
      a.birth_date,
      art.registration_number
    FROM animal_table a
    JOIN animal_flock_prefix_table afp ON afp.id_animalid = a.id_animalid
    JOIN flock_prefix_table ON flock_prefix_table.id_flockprefixid = afp.id_flockprefixid
    LEFT JOIN animal_registration_table art ON art.id_animalid = a.id_animalid
    WHERE a.id_animalid = ?;
  `;

  return new Promise((resolve, reject) => {
    db.all(identificationQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } 

      const row = rows[0] as { 
        flock_prefix: string; 
        animal_name: string; 
        birth_date: string;
        registration_number: string; 
      };

      var bday : Date | null = getDbDate(row.birth_date);

      // only resolve if a valid row is returned
      if (row) {
        const result: AnimalIdentification = {
          id: animalId,
          flockPrefix: row.flock_prefix,
          name: row.animal_name,
          birthDate: bday,
          registrationNumber: row.registration_number,
        };

        resolve(new Success(result));
      } 
        
      // if neither conditions are met, fail out
      resolve(new Failure("No matching animal found."));
    });
  });
};