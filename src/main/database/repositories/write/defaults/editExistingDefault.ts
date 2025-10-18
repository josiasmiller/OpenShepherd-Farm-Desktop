import {Database} from "sqlite3";
import { NewDefaultSettingsParameters } from "packages/api";
import { animalDefaultColumns, getAnimalDefaultValues } from "./defaultParser";

export const editExistingDefaultSettings = async (
  db: Database, queryParams: NewDefaultSettingsParameters
): Promise<boolean> => {

  if (!queryParams.id) {
    console.error("Missing id for update.");
    throw new Error("Missing id for update.");
  }

  const updateColumns = animalDefaultColumns
    .filter((col) => col !== "id_animaltrakkerdefaultsettingsid")
    .map((col) => `${col} = ?`)
    .join(", ");

  const query = `
    UPDATE animaltrakker_default_settings_table
    SET ${updateColumns}
    WHERE id_animaltrakkerdefaultsettingsid = ?
  `;

  const values = getAnimalDefaultValues(queryParams).slice(1); // skip the ID in values
  values.push(queryParams.id); // add ID at the end for WHERE clause

  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};