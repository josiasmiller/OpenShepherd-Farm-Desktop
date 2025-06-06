import { getDatabase } from "../../../dbConnections";
import { NewDefaultSettingsParameters } from "../../../models/write/defaults/newDefaultSettings";
import { animalDefaultColumns, getAnimalDefaultValues } from "./defaultParser";

export const writeNewDefaultSettings = async (queryParams: NewDefaultSettingsParameters): Promise<boolean> => {
  const db = await getDatabase();
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


