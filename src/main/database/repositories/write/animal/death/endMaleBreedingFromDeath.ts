import { Database } from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";
import { 
  ARTIFICIAL_INSEMINATION_FROZEN_LAPROSCOPIC,
  ARTIFICIAL_INSEMINATION_FROZEN_VAGINAL,
} from "src/main/database/dbConstants";

/**
 * Ends all pertinent sections of the `animal_male_breeding_table`
 *
 * @param db - The SQLite Database object
 * @param animalId - The ID of the animal who died
 * @param deathDate - The date to set as the male out date (YYYY-MM-DD)
 * @param deathTime - The time to set as the male out time (HH:MM:SS)
 * @returns Result<void, string> - Success on completion, Failure with error message
 */
export async function endMaleBreedingFromDeath(
  db: Database,
  animalId: string,
  deathDate: string,
  deathTime: string
): Promise<Result<void, string>> {

  const modifiedTimestamp = dateTimeAsString();

  const query = `
    UPDATE animal_male_breeding_table
    SET date_male_out = ?, 
        time_male_out = ?, 
        modified = ?
    WHERE id_animalid = ?
      AND id_servicetypeid NOT IN (?, ?)
      AND (
        date_male_out IS NULL
        OR time_male_out IS NULL
        OR (date_male_out || ' ' || time_male_out) > (? || ' ' || ?)
      )
  `;

  const queryParams : string[] = [
    deathDate, 
    deathTime, 
    modifiedTimestamp, 
    animalId, 
    ARTIFICIAL_INSEMINATION_FROZEN_LAPROSCOPIC, 
    ARTIFICIAL_INSEMINATION_FROZEN_VAGINAL, 
    deathDate, 
    deathTime
  ];

  return new Promise<Result<void, string>>((resolve) => {
    db.run(
      query,
      queryParams,
      (err: Error | null) => {
        if (err) {
          resolve(new Failure(`Failed to end male breeding for animal ${animalId}: ${err.message}`));
        } else {
          resolve(new Success(undefined));
        }
      }
    );
  });
}
