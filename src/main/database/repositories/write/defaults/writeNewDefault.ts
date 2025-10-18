import {Database} from "sqlite3";
import { NewDefaultSettingsParameters } from "packages/api";
import { animalDefaultColumns, getAnimalDefaultValues } from "./defaultParser";

/**
 * writes a row into the `animaltrakker_default_settings_table`
 *
 * @param db The Database to act on
 * @param queryParams a large object containing all default settings data
 * @returns A `Result` containing a boolean on success, 
 *          or a string error message on failure.
 */
export const writeNewDefaultSettings = async (db: Database, queryParams: NewDefaultSettingsParameters): Promise<boolean> => {

  const placeholders = animalDefaultColumns.map(() => "?").join(", "); // Creates "?, ?, ?, ..." 
  const query = `
    INSERT INTO animaltrakker_default_settings_table (${animalDefaultColumns.join(", ")})
    VALUES (${placeholders})
  `;

  return new Promise((resolve, reject) => {
    db.all(query, getAnimalDefaultValues(queryParams), (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};


