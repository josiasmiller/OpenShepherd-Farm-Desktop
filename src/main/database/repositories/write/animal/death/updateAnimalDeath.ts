import { getDatabase } from '../../../../dbConnections';
import { dateTimeAsString } from '../../../../dbUtils';
import { Result, Success, Failure } from 'packages/core/src/resultTypes';

/**
 * Updates the death date and death reason for a given animal.
 *
 * @param animalId - The ID of the animal.
 * @param deathDate - The date the animal died (YYYY-MM-DD).
 * @param deathReasonId - The UUID of the death reason.
 * @returns Result<void, string> - Success if update succeeds, Failure with error message otherwise.
 */
export async function updateAnimalDeath(
  animalId: string,
  deathDate: string,
  deathReasonId: string
): Promise<Result<void, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const query = `
    UPDATE animal_table
    SET
      death_date = ?,
      id_deathreasonid = ?,
      modified = ?
    WHERE id_animalid = ?
  `;

  const todayDt : String = dateTimeAsString();

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, [deathDate, deathReasonId, todayDt, animalId], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    return new Success(undefined);
  } catch (err: any) {
    return new Failure(`Failed to update animal death info: ${err.message}`);
  }
}
