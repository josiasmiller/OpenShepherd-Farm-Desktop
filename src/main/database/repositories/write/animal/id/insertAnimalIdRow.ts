import {Database} from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Result, Success, Failure } from 'packages/core';
import { AnimalIdInfoInput } from 'packages/api'
import { dateTimeAsString } from "../../../../dbUtils";

/**
 * Inserts a row into the animal_id_info_table.
 * This indicates that an animal has an ID tag
 *
 * @param db The Database to act on
 * @param input all pertinent data for a given ID tag
 * @returns A `Result` containing `null` on success, 
 *          or a string error message on failure.
 */
export async function insertAnimalIdInfoRow(
  db: Database,
  input: AnimalIdInfoInput
): Promise<Result<null, string>> {

  const id = uuidv4();

  const query = `
    INSERT INTO animal_id_info_table (
      id_animalidinfoid,
      id_animalid,
      id_idtypeid,
      id_male_id_idcolorid,
      id_female_id_idcolorid,
      id_idlocationid,
      id_date_on,
      id_time_on,
      id_date_off,
      id_time_off,
      id_number,
      id_scrapieflockid,
      official_id,
      id_idremovereasonid,
      created,
      modified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, NULL, ?, ?)
  `;
  
  const todayDt : String = dateTimeAsString();

  const values = [
    id,
    input.animalId,
    input.idType,
    input.idColor,
    input.idColor,
    input.idLocation,
    input.dateOn,
    "00:00:00",
    input.idValue,
    input.idScrapieFlock ?? null,
    input.isOfficial ? 1 : 0,
    todayDt,
    todayDt,
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return new Success(null);
  } catch (err: any) {
    return new Failure(`Failed to insert animal ID info row: ${err.message}`);
  }
}
