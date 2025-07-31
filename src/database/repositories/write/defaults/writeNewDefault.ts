import { getDatabase } from "../../../dbConnections.js";
import { NewDefaultSettingsParameters } from "../../../models/write/defaults/newDefaultSettings.js";
import { animalDefaultColumns, getAnimalDefaultValues } from "./defaultParser.js";

/**
 * writes a row into the `animaltrakker_default_settings_table`
 * 
 * @param queryParams a large object containing all default settings data
 * @returns A `Result` containing a boolean on success, 
 *          or a string error message on failure.
 */
export const writeNewDefaultSettings = async (queryParams: NewDefaultSettingsParameters): Promise<boolean> => {
  const db = getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

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


