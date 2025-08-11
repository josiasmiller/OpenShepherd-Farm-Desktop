import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";

function extractNumericSuffix(regNum: string): number | null {
  const match = regNum.match(/(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export async function verifyLastRegistrationNumberIsUpToDate(
  id_registrationtypeid: string
): Promise<Result<boolean, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  try {
    // 1. Get last_registration_number from registration_type_table
    const lastRegNumber: string | null = await new Promise((resolve, reject) => {
      const query = `
        SELECT last_registration_number
        FROM registration_type_table
        WHERE id_registrationtypeid = ?
        LIMIT 1
      `;
      db.get(query, [id_registrationtypeid], (err, row: { last_registration_number: string }) => {
        if (err) return reject(err);
        if (!row || !row.last_registration_number) return resolve(null);
        resolve(row.last_registration_number);
      });
    });

    if (!lastRegNumber) {
      // Return Success(false) here — no last reg number means out-of-date or no record
      return new Success(false);
    }

    const lastRegNumSuffix = extractNumericSuffix(lastRegNumber);
    if (lastRegNumSuffix === null) {
      // Also treat as outdated (can't parse suffix)
      return new Success(false);
    }

    // 2. Get all registration_number from animal_registration_table for this registration type
    const allRegNumbers: string[] = await new Promise((resolve, reject) => {
      const query = `
        SELECT registration_number
        FROM animal_registration_table
        WHERE id_animalregistrationtypeid = ?
          AND registration_number IS NOT NULL
      `;
      db.all(query, [id_registrationtypeid], (err, rows: [{ registration_number: string }]) => {
        if (err) return reject(err);
        resolve(rows.map(r => r.registration_number));
      });
    });

    if (allRegNumbers.length === 0) {
      // No registration numbers means nothing to compare, so treat as outdated
      return new Success(false);
    }

    // 3. Find max numeric suffix from all registration numbers
    let maxSuffix = -Infinity;
    for (const regNum of allRegNumbers) {
      const suffix = extractNumericSuffix(regNum);
      if (suffix !== null && suffix > maxSuffix) {
        maxSuffix = suffix;
      }
    }

    // 4. Compare with last_registration_number suffix
    if (maxSuffix > lastRegNumSuffix) {
      // Outdated
      return new Success(false);
    }

    // All good, up-to-date
    return new Success(true);

  } catch (err: any) {
    return new Failure(`Failed to verify last registration number: ${err.message}`);
  }
}
