import { getDatabase } from "../../../dbConnections.js";
import { DefaultSettingsResults } from "../../../models/read/defaults/getExistingDefaults.js";

export const getExistingDefaults = async (): Promise<DefaultSettingsResults[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let defaultsQuery = `
    SELECT 
      id_animaltrakkerdefaultsettingsid AS id, 
      default_settings_name AS name 
    FROM animaltrakker_default_settings_table`;

  return new Promise((resolve, reject) => {
    db.all(defaultsQuery, [], (err, rows) => {
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