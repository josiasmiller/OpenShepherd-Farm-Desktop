import { Database } from "@database/async";
import { AnimalDetails } from "@app/api";
import { CHARACTERISTIC_COAT_COLOR, REGISTRATION_TYPE_REGISTERED } from "@database/schema";
import { Failure, Result, Success } from "@common/core";

/**
 * Fetches basic animal info for a list of animal UUIDs.
 * Uses the async Database wrapper (promise-based sqlite3).
 */
export const getAnimalDetails = async (
  db: Database,
  animalIds: string[]
): Promise<Result<AnimalDetails[], string>> => {
  if (!animalIds || animalIds.length === 0) {
    return new Success([]);
  }

  try {
    const placeholders = animalIds.map(() => "?").join(", ");

    const query = `
      WITH latest_registration AS (
        SELECT id_animalid, registration_number FROM ( 
          SELECT 
            ar.id_animalid,
            ar.registration_number,
          ROW_NUMBER() OVER (
            PARTITION BY ar.id_animalid 
            ORDER BY DATE(ar.registration_date) DESC
          ) AS rn
            FROM animal_registration_table ar
            WHERE ar.registration_date IS NOT NULL
          AND ar.id_animalregistrationtypeid = '${REGISTRATION_TYPE_REGISTERED}'
          AND ar.id_animalid in (${placeholders})
          ORDER BY ar.id_animalid, ar.registration_date DESC -- <-- Makes sure most recent regnum is showing up
        )
        WHERE rn = 1
      ),
      coat_colors AS (
        SELECT
          agct.id_animalid,
          gcc.coat_color
        FROM animal_genetic_characteristic_table agct
        JOIN genetic_coat_color_table gcc 
          ON gcc.id_geneticcoatcolorid = agct.id_geneticcharacteristicvalueid
        WHERE agct.id_geneticcharacteristictableid = '${CHARACTERISTIC_COAT_COLOR}'
        AND agct.id_animalid in (${placeholders})
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
      LEFT JOIN latest_registration lr ON lr.id_animalid = a.id_animalid
      WHERE a.id_animalid IN (${placeholders});
    `;

    const queryParams : string[] = [...animalIds, ...animalIds, ...animalIds]; // handle all placeholder sections

    const rows = await db.all<any>(query, queryParams);

    const animals = rows.map(row => ({
      animalId: row.id_animalid,
      flockPrefix: row.flock_prefix ?? "—",
      name: row.animal_name ?? "—",
      registrationNumber: row.registration_number ?? null,
      birthDate: row.birth_date ?? null,
      coatColor: row.coat_color ?? "Unknown",
    })) as AnimalDetails[];

    if (animals.length !== animalIds.length) {
      return new Failure(
        `Expected ${animalIds.length} records, but retrieved ${animals.length}`
      );
    }

    return new Success(animals);

  } catch (err: any) {
    return new Failure(`Unable to query AnimalDetails: ${err}`);
  }
};
