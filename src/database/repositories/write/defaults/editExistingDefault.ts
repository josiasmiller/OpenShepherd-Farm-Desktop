import { getDatabase } from "../../../dbConnections.js";
import { NewDefaultSettingsParameters } from "../../../models/write/defaults/newDefaultSettings.js";
import { animalDefaultColumns, getAnimalDefaultValues } from "./defaultParser.js";

export const editExistingDefaultSettings = async (
  queryParams: NewDefaultSettingsParameters
): Promise<boolean> => {
  console.log("\n\n\nWEWLAD!!!\n\n\n");
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  if (!queryParams.id) {
    console.error("Missing id for update.");
    throw new Error("Missing id for update.");
  }

  const updateColumns = animalDefaultColumns
    .filter((col) => col !== "id_animaltrakkerdefaultsettingsid")
    .map((col) => `${col} = ?`)
    .join(", ");

  console.log("UPDATE COLS:");
  console.log(updateColumns);

  const query = `
    UPDATE animaltrakker_default_settings_table
    SET ${updateColumns}
    WHERE id_animaltrakkerdefaultsettingsid = ?
  `;

  console.log("got here at least");

  const values = getAnimalDefaultValues(queryParams).slice(1); // skip the ID in values
  values.push(queryParams.id); // add ID at the end for WHERE clause

  console.log("VALUES");
  console.log(values);

  console.log("row id:");
  console.log(queryParams.id);

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