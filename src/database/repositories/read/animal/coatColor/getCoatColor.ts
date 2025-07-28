import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { CHARACTERISTIC_COAT_COLOR } from "../../../../dbConstants.js";
import { CoatColor } from "../../../../models/read/animal/coatColor/coatColor.js";

interface CoatColorRow {
  coatColor: string;
  coatColorId: string;
  coatColorAbbrev: string;
  registryCompanyId: string;
}


/**
 * Retrieves the coat color of a specific animal.
 * @param animalId UUID of the animal being searched for
 */
export async function getCoatColorForAnimal(
  animalId: string
): Promise<Result<CoatColor, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT
      g.id_geneticcoatcolorid AS coatColorId,
      g.coat_color AS coatColor,
      g.coat_color_abbrev AS coatColorAbbrev,
      g.id_registry_id_companyid AS registryCompanyId
    FROM animal_genetic_characteristic_table agc
    INNER JOIN genetic_coat_color_table g
      ON agc.id_geneticcharacteristicvalueid = g.id_geneticcoatcolorid
    WHERE agc.id_animalid = ?
      AND agc.id_geneticcharacteristictableid = ?
    ORDER BY agc.genetic_characteristic_date DESC, agc.genetic_characteristic_time DESC
    LIMIT 1
  `;

  const values = [animalId, CHARACTERISTIC_COAT_COLOR];

  return new Promise((resolve) => {
    db.get(query, values, (err, row : CoatColorRow) => {
      if (err) {
        resolve(new Failure(`Failed to get coat color: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No coat color found for animal ID: ${animalId}`));
      } else {

        const result: CoatColor = {
          name: row.coatColor,
          id: row.coatColorId,
          abbrev: row.coatColorAbbrev,
          registryCompanyId: row.registryCompanyId,
        };
        resolve(new Success(result));
      }
    });
  });
}
