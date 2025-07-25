import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { getSQLiteDateStringNow } from "../../../../dbUtils.js";
import { AnimalIdInfoInput } from "../../../../models/write/animal/id/animalIdInfoInput.js";

/**
 * Inserts a row into the animal_id_info_table.
 */
export async function insertAnimalIdInfoRow(
  input: AnimalIdInfoInput
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const id = uuidv4();
  const created = getSQLiteDateStringNow();
  const modified = created;

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
    created,
    modified,
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
