import { getDatabase } from '../../../../dbConnections';
import { dateTimeAsString } from '../../../../dbUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Inserts a coat color record into the animal_genetic_characteristic_table.
 *
 * @param animalId - The ID of the animal.
 * @param coatColorId - The ID representing the coat color value.
 * @param dateObserved - The date the coat color was observed (format: YYYY-MM-DD).
 * @returns The ID of the newly inserted animal genetic characteristic record.
 */
export async function insertGeneticCoatRow(
  animalId: string,
  coatColorId: string,
  dateObserved: string
): Promise<string> {
  const db = getDatabase();
  if (!db) throw new Error('DB instance is null');

  const id = uuidv4();

  const geneticCharacteristicTableId = '0972486b-7b99-427e-b942-fa5ec88c2678'; // fixed UUID for coat color
  const calculationMethodId = '1ae4b983-104a-4e8e-b269-ff3790608c8d';          // fixed UUID for 'Observation'

  const query = `
    INSERT INTO animal_genetic_characteristic_table (
      id_animalgeneticcharacteristicid,
      id_animalid,
      id_geneticcharacteristictableid,
      id_geneticcharacteristicvalueid,
      id_geneticcharacteristiccalculationmethodid,
      genetic_characteristic_date,
      genetic_characteristic_time,
      created,
      modified
    ) VALUES (?, ?, ?, ?, ?, ?, "00:00:00", ?, ?)
  `;

  const todayDt : String = dateTimeAsString();

  return new Promise<string>((resolve, reject) => {
    db.run(
      query,
      [
        id,
        animalId,
        geneticCharacteristicTableId,
        coatColorId,
        calculationMethodId,
        dateObserved,
        todayDt,
        todayDt,
      ],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      }
    );
  });
}
