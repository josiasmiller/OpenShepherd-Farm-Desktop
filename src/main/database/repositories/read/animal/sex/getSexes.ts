import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { Sex } from "packages/api";

/**
 * gets all sexes from the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `Sex` objects on success, 
 *          or a string error message on failure.
 */
export const getSexes = async (db: Database): Promise<Result<Sex[], string>> => {

  let sexQuery = `
    SELECT 
        id_sexid AS id, 
        sex_name AS name,
        sex_display_order AS display_order,
        id_speciesid AS species_id
    FROM sex_table`;

  return new Promise((resolve, reject) => {
    db.all(sexQuery, [], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: Sex[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
          species_id: row.species_id,
        }));

        resolve(new Success(results));
      }
    });
  });
};