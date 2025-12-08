import {Database} from "@database/async";
import {ItemEntry} from "@app/api";

/**
 * Fetches lightweight item entry for a
 * default settings record in the database.
 * @param db
 * @param defaultSettingsId
 */
export const getDefaultSettingsEntry = async (db: Database, defaultSettingsId: string): Promise<ItemEntry | null> => {
  const query = `
      SELECT id_animaltrakkerdefaultsettingsid AS id, default_settings_name AS name
      FROM animaltrakker_default_settings_table
      WHERE id_animaltrakkerdefaultsettingsid = ?
  `;

  return db.get<ItemEntry>(query, defaultSettingsId)
    .catch(_ => null);
}
