import {Database} from "sqlite3";
import {Failure, Result, Success} from "@common/core";
import {REGISTRATION_CHOCOLATE_WELSH, REGISTRATION_REGISTERED, REGISTRATION_WHITE_WELSH} from "../../../../dbConstants";
import { dateTimeAsString } from "../../../../dbUtils";

function incrementRegisteredValue(originalRegNum: string): string {
  const length = originalRegNum.length;
  return (parseInt(originalRegNum, 10) + 1).toString().padStart(length, "0");
}

function incrementChocolateRegistryValue(originalRegNum: string): string {
  const [prefix, num] = originalRegNum.split("-");
  const length = num.length;
  const incremented = (parseInt(num, 10) + 1).toString().padStart(length, "0");
  return `${prefix}-${incremented}`;
}

function incrementWhiteRegistryValue(originalRegNum: string): string {
  const [prefix, num] = originalRegNum.split("-");
  const length = num.length;
  const incremented = (parseInt(num, 10) + 1).toString().padStart(length, "0");
  return `${prefix}-${incremented}`;
}


/**
 * increments a given reistration value and returns the new, non-used value
 *
 * @param db The Database to act on
 * @param registrationTypeId UUID of the registration type being incremented. This should always relate to the black, chocolate, or white registries.
 * @returns A `Result` containing the new registration number on success, 
 *          or a string error message on failure.
 */
export async function incrementLastRegistrationNumber(db: Database, registrationTypeId : string): Promise<Result<string, string>> {

  try {
    const row = await new Promise<{ last_registration_number: string } | undefined>((resolve, reject) => {
      db.get(
        `SELECT last_registration_number FROM registration_type_table WHERE id_registrationtypeid = ?`,
        [registrationTypeId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as { last_registration_number: string });
        }
      );
    });

    if (!row || !row.last_registration_number) {
      return new Failure("Registration type not found or missing last_registration_number");
    }

    let newNumber : string;

    if (registrationTypeId == REGISTRATION_REGISTERED) {
      newNumber = incrementRegisteredValue(row.last_registration_number);
    } else if (registrationTypeId == REGISTRATION_CHOCOLATE_WELSH) {
      newNumber = incrementChocolateRegistryValue(row.last_registration_number);
    } else if (registrationTypeId == REGISTRATION_WHITE_WELSH) {
      newNumber = incrementWhiteRegistryValue(row.last_registration_number);
    } else {
      return new Failure(`Failed to increment registration number: unhandled registration type with UUID=\'${registrationTypeId}\'`);
    }

    const todayDt : string = dateTimeAsString();

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE registration_type_table SET last_registration_number = ?, modified = ? WHERE id_registrationtypeid = ?`,
        [newNumber, todayDt, registrationTypeId],
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
