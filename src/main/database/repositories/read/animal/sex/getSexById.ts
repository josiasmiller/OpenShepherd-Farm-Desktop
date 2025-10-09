import {Database} from "sqlite3";
import { Result, Success, Failure } from '@common/core';
import { Sex } from '@app/api';

/**
 * Retrieves a Sex object by its UUID.
 * @param db The Database to act on
 * @param sexId - The UUID of the sex record.
 * @returns Result<Sex, string> - Success with the Sex object if found, or Failure with an error message.
 */
export async function getSexById(db: Database, sexId: string): Promise<Result<Sex, string>> {

  const query = `
    SELECT
      id_sexid AS id,
      sex_name AS name,
      sex_display_order AS display_order,
      id_speciesid AS species_id
    FROM sex_table
    WHERE id_sexid = ?
  `;

  try {
    const row: any = await new Promise((resolve, reject) => {
      db.get(query, [sexId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!row) {
      return new Failure(`No sex found with id: ${sexId}`);
    }

    const sex: Sex = {
      id: row.id,
      name: row.name,
      display_order: row.display_order,
      species_id: row.species_id,
    };

    return new Success(sex);
  } catch (err: any) {
    return new Failure(`Failed to retrieve sex: ${err.message}`);
  }
}
