import { getDatabase } from '../../../../dbConnections';
import { dateTimeAsString } from '../../../../dbUtils';
import { v4 as uuidv4 } from 'uuid';

interface BreedPercentageRow {
  id_breedid: string;
  breed_percentage: number;
}

type BreedMap = Map<string, number>;

/**
 * combines both parent's of an animal into one breed map
 * 
 * @param sireBreeds breed data for the animal's sire
 * @param damBreeds breed data for the animal's dam
 * @returns BreedMap
 */
function combineBreedPercentages(
  sireBreeds: BreedPercentageRow[],
  damBreeds: BreedPercentageRow[]
): BreedMap {
  const result = new Map<string, number>();

  const half = (rows: BreedPercentageRow[]) => {
    for (const row of rows) {
      const current = result.get(row.id_breedid) || 0;
      result.set(row.id_breedid, current + row.breed_percentage / 2);
    }
  };

  half(sireBreeds);
  half(damBreeds);

  return result;
}

/**
 * writes the breed percentages to the DB of a given animal
 * 
 * @param animalId UUID of animal whose percentages must be written
 * @param sireId UUID of the animal's father
 * @param damId UUID of the animal's mother
 * @returns void
 */
export async function writeAnimalBreedPercentages(
  animalId: string,
  sireId: string,
  damId: string,
): Promise<void> {
  const db = getDatabase();
  if (!db) throw new TypeError("DB Instance is null");

  const fetchBreeds = (parentId: string): Promise<BreedPercentageRow[]> => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id_breedid, breed_percentage FROM animal_breed_table WHERE id_animalid = ?`,
        [parentId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as BreedPercentageRow[]);
        }
      );
    });
  };

  const sireBreeds = await fetchBreeds(sireId);
  const damBreeds  = await fetchBreeds(damId);

  if (sireBreeds.length === 0 && damBreeds.length === 0) {
    console.warn(`No breed data found for sire [${sireId}] or dam [${damId}]. Skipping insert.`);
    return;
  }

  const breedMap = combineBreedPercentages(sireBreeds, damBreeds);
  
  const insertBreed = (
    breedId: string,
    percentage: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO animal_breed_table (
          id_animalbreedid,
          id_animalid,
          id_breedid,
          breed_percentage,
          created,
          modified
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const todayDt : String = dateTimeAsString();

      const values = [uuidv4(), animalId, breedId, percentage, todayDt, todayDt];
      db.run(query, values, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  for (const [breedId, percentage] of breedMap) {
    if (percentage > 0) {
      await insertBreed(breedId, percentage);
    }
  }
}
