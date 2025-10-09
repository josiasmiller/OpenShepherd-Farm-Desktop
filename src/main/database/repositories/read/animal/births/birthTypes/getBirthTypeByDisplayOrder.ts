import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";
import { BirthType } from '@app/api';

interface BirthTypeRow {
  id: string;
  name: string;
  abbrev: string;
  display_order: number;
}

/**
 * gets a specific `BirthType` from the DB using the display order value
 * @param db The Database to act on.
 * @param displayOrder The integer `birth_type_display_order` to search for
 * @returns A `Result` containing a `BirthType` object on success, 
 *          or a string error message on failure.
 */
export const getBirthTypeByDisplayOrder = async (db: Database, displayOrder: number): Promise<Result<BirthType, string>> => {

  const query = `
    SELECT 
      id_birthtypeid AS id, 
      birth_type AS name,
      birth_type_abbrev AS abbrev, 
      birth_type_display_order AS display_order
    FROM birth_type_table
    WHERE birth_type_display_order = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [displayOrder], (err, row: BirthTypeRow | undefined) => {
      if (err) {
        reject(new Failure<string>(err.message));
      } else if (!row) {
        resolve(new Failure<string>(`No BirthType found for display order: ${displayOrder}`));
      } else {
        const result: BirthType = {
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        };
        resolve(new Success<BirthType>(result));
      }
    });
  });
};
