import {Database} from "sqlite3";
import { dateTimeAsString } from '../../../../dbUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Inserts a new row into animal_flock_prefix_table linking an animal to a flock prefix.
 *
 * @param db The Database to act on
 * @param idAnimalId - The ID of the animal (string)
 * @param idFlockprefixId - The ID of the flock prefix (string)
 * @returns The newly inserted animal_flockprefixid (string)
 */
export async function insertAnimalFlockTableRow(
  db: Database,
  idAnimalId: string,
  idFlockprefixId: string
): Promise<string> {

  const idAnimalFlockprefixid = uuidv4();

  const query = `
    INSERT INTO animal_flock_prefix_table (
      id_animalflockprefixid,
      id_animalid,
      id_flockprefixid,
      created,
      modified
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const todayDt : String = dateTimeAsString();  

  return new Promise<string>((resolve, reject) => {
    db.run(
      query,
      [
        idAnimalFlockprefixid,
        idAnimalId,
        idFlockprefixId,
        todayDt,
        todayDt,
      ],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(idAnimalFlockprefixid);
        }
      }
    );
  });
}
