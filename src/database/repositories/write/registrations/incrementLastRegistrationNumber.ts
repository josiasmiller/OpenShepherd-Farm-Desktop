import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";
import { REGISTRATION_REGISTERED } from "../../../dbConstants.js";


export function incrementRegisteredValue(originalRegNum: string): string {
  const length = originalRegNum.length;
  const incremented = (parseInt(originalRegNum, 10) + 1).toString().padStart(length, "0");
  return incremented;
}

/**
 * increments the last registration number for `Registered` type in the DB
 */
export async function incrementLastRegistrationNumber(): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  try {
    const row = await new Promise<{ last_registration_number: string } | undefined>((resolve, reject) => {
      db.get(
        `SELECT last_registration_number FROM registration_type_table WHERE id_registrationtypeid = ?`,
        [REGISTRATION_REGISTERED],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as { last_registration_number: string });
        }
      );
    });

    if (!row || !row.last_registration_number) {
      return new Failure("Registration type not found or missing last_registration_number");
    }

    const newNumber = incrementRegisteredValue(row.last_registration_number);

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE registration_type_table SET last_registration_number = ?, modified = datetime('now') WHERE id_registrationtypeid = ?`,
        [newNumber, REGISTRATION_REGISTERED],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return new Success(newNumber);
  } catch (err: any) {
    return new Failure(`Failed to increment registration number: ${err.message}`);
  }
}
