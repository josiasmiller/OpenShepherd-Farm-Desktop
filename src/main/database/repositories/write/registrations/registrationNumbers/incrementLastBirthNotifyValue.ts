import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { REGISTRATION_BIRTH_NOTIFY } from "../../../../dbConstants";
import { dateTimeAsString } from "../../../../dbUtils";


function incrementStringId(id: string): string {
  const match = id.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) throw new Error("Invalid format");

  const prefix = match[1];
  const numberStr = match[2];

  const numberLength = numberStr.length;
  const incrementedNumber = (parseInt(numberStr, 10) + 1)
    .toString()
    .padStart(numberLength, "0");

  return `${prefix}${incrementedNumber}`;
}

/**
 * increments the last birth notify value by 1 and then returns the new, non-used registration value.
 * Should always be in the format `BNYYYY` where `YYYY` is the current iteration
 * 
 * @returns A `Result` containing the new BN value on success, 
 *          or a string error message on failure.
 */
export async function incrementLastBirthNotifyValue(): Promise<Result<string, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  try {
    const row = await new Promise<{ last_registration_number: string } | undefined>((resolve, reject) => {
      db.get(
        `SELECT last_registration_number FROM registration_type_table WHERE id_registrationtypeid = ?`,
        [REGISTRATION_BIRTH_NOTIFY],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as { last_registration_number: string });
        }
      );
    });

    if (!row || !row.last_registration_number) {
      return new Failure("Registration type not found or missing last_registration_number");
    }

    const newNumber = incrementStringId(row.last_registration_number);

    const todayDt : string = dateTimeAsString();

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE registration_type_table SET last_registration_number = ?, modified = ? WHERE id_registrationtypeid = ?`,
        [newNumber, todayDt, REGISTRATION_BIRTH_NOTIFY],
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
