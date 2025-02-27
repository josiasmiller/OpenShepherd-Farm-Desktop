import { getDatabase } from "../../dbConnections.js";
import { DefaultSettingsResults } from "../../models/defaults/getExistingDefaults";

export const getExistingDefaults = async (): Promise<DefaultSettingsResults[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let animalQuery = `
    SELECT id_animaltrakkerdefaultsettingsid AS id, user_name AS name 
    FROM animaltrakker_default_settings_table`;

  return new Promise((resolve, reject) => {
    db.all(animalQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: DefaultSettingsResults[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name
        }));

        resolve(results);
      }
    });
  });
};