import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";

type LastRegistrationRow = {
  last_registration_number: string | null;
};

/**
 * Retrieves the last_registration_number for the hardcoded registration type ID.
 *
 * @param db The Database to act on
 * @param registrationType The type of registration for the value to retrieve
 */
export async function getLastRegisteredValue(db: Database, registrationType : string): Promise<Result<string | null, string>> {

  const query = `
    SELECT last_registration_number
    FROM registration_type_table
    WHERE id_registrationtypeid = ?
  `;

  try {
    const row = await new Promise<LastRegistrationRow | undefined>((resolve, reject) => {
      db.get(query, [registrationType], (err, row) => {
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
