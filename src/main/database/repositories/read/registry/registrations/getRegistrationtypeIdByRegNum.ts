import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure } from "packages/core";


/**
 * Get the registration type ID for a given registration number.
 * @param registrationNumber The registration number to look up
 * @returns A Result containing the registration type ID string on success, or an error message
 */
export const getRegistrationTypeIdByRegNum = async (
  registrationNumber: string
): Promise<Result<string, string>> => {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT id_animalregistrationtypeid
    FROM animal_registration_table
    WHERE registration_number = ?
    LIMIT 1
  `;

  try {
    const regTypeId: string | null = await new Promise((resolve, reject) => {
      db.get(query, [registrationNumber], (err, row: { id_animalregistrationtypeid: string } | undefined) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row.id_animalregistrationtypeid);
      });
    });

    if (!regTypeId) {
      return new Failure(`No registration type found for registration number: ${registrationNumber}`);
    }

    return new Success(regTypeId);
  } catch (err: any) {
    return new Failure(`Failed to query registration type: ${err.message}`);
  }
};