import {Database} from "@database/async";
import log from "electron-log";

export const defaultSettingsExists = async (db: Database, id: string): Promise<boolean> => {
  return await db.get<{ default_settings_exists: boolean }>(QUERY_DEFAULT_SETTINGS_EXISTS, id)
    .then((result): boolean => {
      return result.default_settings_exists
    })
    .catch((err): boolean => {
      log.error(`Failed to query existence of default settings with id=${id}.`, err)
      return false
    })
}

const QUERY_DEFAULT_SETTINGS_EXISTS = `SELECT EXISTS (
  SELECT 1 FROM animaltrakker_default_settings_table
    WHERE id_animaltrakkerdefaultsettingsid = ?
) AS default_settings_exists`
