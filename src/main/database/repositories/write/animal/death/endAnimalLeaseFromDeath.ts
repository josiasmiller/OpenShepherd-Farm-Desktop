import { Database } from "sqlite3";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";

/**
 * Ends all active leases for an animal by setting the end date to its death date.
 *
 * @param db - The SQLite Database object
 * @param animalId - The ID of the animal whose leases are to be ended
 * @param deathDate - The date to set as the end of lease (YYYY-MM-DD)
 * @returns Result<void, string> - Success on completion, Failure with error message
 */
export async function endAnimalLeaseFromDeath(
  db: Database,
  animalId: string,
  deathDate: string
): Promise<Result<void, string>> {

  const modifiedTimestamp = dateTimeAsString();

  const query = `
    UPDATE animal_on_lease_table
    SET end_lease_date = ?, modified = ?
    WHERE id_animalid = ? AND end_lease_date IS NULL
  `;

  return new Promise<Result<void, string>>((resolve) => {
    db.run(query, [deathDate, modifiedTimestamp, animalId], (err: Error | null) => {
      if (err) {
        resolve(new Failure(`Failed to end leases for animal ${animalId}: ${err.message}`));
      } else {
        resolve(new Success(undefined));
      }
    });
  });
}
