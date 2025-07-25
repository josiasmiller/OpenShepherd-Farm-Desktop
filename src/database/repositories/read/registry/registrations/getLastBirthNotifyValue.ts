import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { REGISTRATION_BIRTH_NOTIFY } from "../../../../dbConstants.js";

type LastRegistrationRow = {
  last_registration_number: string | null;
};

/**
 * Retrieves the last_registration_number for the hardcoded registration type ID.
 */
export async function getLastBirthNotifyValue(): Promise<Result<string | null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT last_registration_number
    FROM registration_type_table
    WHERE id_registrationtypeid = ?
  `;

  try {
    const row = await new Promise<LastRegistrationRow | undefined>((resolve, reject) => {
      db.get(query, [REGISTRATION_BIRTH_NOTIFY], (err, row) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        } else {
          resolve(row as LastRegistrationRow | undefined);
        }
      });
    });

    if (!row) return new Failure("No registration type found for the specified ID");

    return new Success(row.last_registration_number);
  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}
