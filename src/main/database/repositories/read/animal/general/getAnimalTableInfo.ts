import { Database } from "sqlite3";
import { AnimalBasicInfo } from "packages/api";
import { CHARACTERISTIC_COAT_COLOR } from "../../../../../../../src/main/database/dbConstants"; // TODO --> better import path???
import { Failure, Result, Success } from "packages/core/src";


/**
 * Fetches basic animal info for a list of animal UUIDs.
 * Pulls coat color from animal_genetic_characteristic_table + genetic_coat_color_table.
 */
export const getBasicAnimalInfo = async (
  db: Database,
  animalIds: string[]
): Promise<Result<AnimalBasicInfo[], string>> => {
  if (!animalIds || animalIds.length === 0) {
    return new Success([]);
  }

  const placeholders = animalIds.map(() => "?").join(", ");

  const query = `
    WITH latest_registration AS (
      SELECT 
        ar.id_animalid,
        ar.registration_number,
        ROW_NUMBER() OVER (
          PARTITION BY ar.id_animalid 
          ORDER BY DATE(ar.registration_date) DESC
        ) AS rn
      FROM animal_registration_table ar
      WHERE ar.registration_date IS NOT NULL
    ),
    coat_colors AS (
      SELECT
        agct.id_animalid,
        gcc.coat_color
      FROM animal_genetic_characteristic_table agct
      JOIN genetic_coat_color_table gcc 
        ON gcc.id_geneticcoatcolorid = agct.id_geneticcharacteristicvalueid
      WHERE agct.id_geneticcharacteristictableid = '${CHARACTERISTIC_COAT_COLOR}'
    )
    SELECT 
      a.id_animalid,
      a.animal_name,
      a.birth_date,
      COALESCE(cc.coat_color, 'Unknown') AS coat_color,
      fp.flock_prefix,
      lr.registration_number
    FROM animal_table a
    LEFT JOIN coat_colors cc ON a.id_animalid = cc.id_animalid
    LEFT JOIN animal_flock_prefix_table afp ON afp.id_animalid = a.id_animalid
    LEFT JOIN flock_prefix_table fp ON fp.id_flockprefixid = afp.id_flockprefixid
    LEFT JOIN latest_registration lr ON lr.id_animalid = a.id_animalid AND lr.rn = 1
    WHERE a.id_animalid IN (${placeholders});
  `;

  return new Promise((resolve, reject) => {
    db.all(query, animalIds, (err, rows) => {
      if (err) {
        reject(new Failure(`Unable to query for BasicAnimalInfo: ${err}`));
      } else {
        const animals = rows.map((row: any) => ({
          animalId: row.id_animalid,
          flockPrefix: row.flock_prefix ?? "—",
          name: row.animal_name ?? "—",
          registrationNumber: row.registration_number ?? null,
          birthDate: row.birth_date ?? null,
          coatColor: row.coat_color ?? "Unknown",
        })) as AnimalBasicInfo[];

        resolve(new Success(animals));
      }
    });
  });
};
