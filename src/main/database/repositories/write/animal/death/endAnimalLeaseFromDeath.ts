import { Database } from "@database/async";
import { dateTimeAsString } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";

/**
 * Ends all active leases for an animal by setting the end date to its death date.
 *
 * @param db - The async Database wrapper
 * @param animalId - The ID of the animal whose leases are to be ended
 * @param deathDate - The date to set as the end of lease (YYYY-MM-DD)
 * @returns Result<void, string>
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

  try {
    const _ = await db.run(query, [
      deathDate,
      modifiedTimestamp,
      animalId,
    ]);

    return new Success(undefined);

  } catch (err: any) {
    return new Failure(
        `Failed to end leases for animal ${animalId}: ${err.message}`
    );
  }
}
