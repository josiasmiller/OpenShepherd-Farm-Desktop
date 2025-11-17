import {Database} from "sqlite3";
import { Result, Success, Failure } from "@common/core";
import { Species } from '@app/api';

/**
 * gets all species from the DB
 * @returns A `Result` containing an array of `Species` objects on success, 
 *          or a string error message on failure.
 */
export const getSpecies = async (db: Database): Promise<Result<Species[], string>> => {

  let speciesQuery = `
    SELECT 
        id_speciesid AS id, 
        species_common_name AS common_name,
        species_generic_name AS generic_name,
        species_scientific_name AS scientific_name
    FROM species_table`;

  return new Promise((resolve) => {
    db.all(speciesQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Error executing query: ${err.message}`));
      } else {
        const results: Species[] = rows.map((row: any) => ({
          id: row.id,
          common_name: row.common_name,
          generic_name: row.generic_name,
          scientific_name: row.scientific_name,
        }));
        resolve(new Success(results));
      }
    });
  });
};