import { getDatabase } from '../../../../dbConnections.js';
import { getSQLiteDateStringNow } from '../../../../dbUtils.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Inserts a new row into animal_flock_prefix_table linking an animal to a flock prefix.
 * 
 * @param idAnimalId - The ID of the animal (string)
 * @param idFlockprefixId - The ID of the flock prefix (string)
 * @returns The newly inserted animal_flockprefixid (string)
 */
export async function insertAnimalFlockTableRow(
  idAnimalId: string,
  idFlockprefixId: string
): Promise<string> {
  const db = getDatabase();
  if (!db) throw new Error("DB instance is null");

  const idAnimalFlockprefixid = uuidv4();
  const created = getSQLiteDateStringNow();
  const modified = created;

  const query = `
    INSERT INTO animal_flock_prefix_table (
      id_animalflockprefixid,
      id_animalid,
      id_flockprefixid,
      created,
      modified
    ) VALUES (?, ?, ?, ?, ?)
  `;

  return new Promise<string>((resolve, reject) => {
    db.run(
      query,
      [
        idAnimalFlockprefixid,
        idAnimalId,
        idFlockprefixId,
        created,
        modified,
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
