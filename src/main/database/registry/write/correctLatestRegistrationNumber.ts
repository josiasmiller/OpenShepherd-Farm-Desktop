import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";

/**
 * Updates the last_registration_number in registration_type_table
 * to the highest registration_number found in animal_registration_table
 * for the given registrationTypeId.
 */
export async function correctLatestRegistrationNumber(
  db: Database, id_registrationtypeid: string
): Promise<Result<boolean, string>> {

  // Helper to extract numeric suffix
  function extractNumericSuffix(regNum: string): number | null {
    const match = regNum.match(/(\d+)$/);
    if (!match) return null;
    return parseInt(match[1], 10);
  }

  try {
    // 1. Get all registration numbers for this type
    const allRegNumbers: string[] = await new Promise((resolve, reject) => {
      const query = `
        SELECT registration_number
        FROM animal_registration_table
        WHERE id_animalregistrationtypeid = ?
          AND registration_number IS NOT NULL
      `;
      db.all(query, [id_registrationtypeid], (err, rows: { registration_number: string }[]) => {
        if (err) return reject(err);
        resolve(rows.map((r: { registration_number: string }) => r.registration_number));
      });
    });

    if (allRegNumbers.length === 0) {
      return new Failure(`No registration numbers found for registration type id=${id_registrationtypeid}`);
    }

    // 2. Find max numeric suffix and corresponding full reg number
    let maxSuffix = -Infinity;
    let maxRegNumber = "";
    for (const regNum of allRegNumbers) {
      const suffix = extractNumericSuffix(regNum);
      if (suffix !== null && suffix > maxSuffix) {
        maxSuffix = suffix;
        maxRegNumber = regNum;
      }
    }

    if (!maxRegNumber) {
      return new Failure(`Unable to determine max registration number for type id=${id_registrationtypeid}`);
    }

    // 3. Update last_registration_number to maxRegNumber
    await new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE registration_type_table
        SET last_registration_number = ?
        WHERE id_registrationtypeid = ?
      `;
      db.run(updateQuery, [maxRegNumber, id_registrationtypeid], function(err) {
        if (err) return reject(err);
        resolve(true);
      });
    });

    return new Success(true);
  } catch (err: any) {
    return new Failure(`Failed to correct last registration number: ${err.message}`);
  }
}
