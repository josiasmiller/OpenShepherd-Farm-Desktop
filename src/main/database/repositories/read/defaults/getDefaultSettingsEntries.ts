import {Database} from "@database/async";
import {ItemEntry} from "@app/api";

/**
 * Fetches lightweight item entries for all
 * default settings records in the database.
 * @param db
 */
export const getDefaultSettingsEntries = async (db: Database): Promise<ItemEntry[]> => {
  const query = `
      SELECT id_animaltrakkerdefaultsettingsid AS id, default_settings_name AS name
      FROM animaltrakker_default_settings_table
  `;

  return db.all<ItemEntry>(query)
    .catch(_ => []);
}
