import { getDatabase } from "../../../../dbConnections.js";
import { escapeLikeString } from "../../../../dbUtils.js";
import { AnimalSearchRequest, AnimalSearchResult } from "../../../../models/read/animal/animalSeach/animalSearch.js";

export const animalSearch = async (queryParams: AnimalSearchRequest = {}): Promise<AnimalSearchResult[]> => {
  const db = getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  // Base query
  let animalQuery = `
    WITH latest_registration AS (
      SELECT 
        ar.id_animalid,
        ar.registration_number,
        ar.registration_date,
        ROW_NUMBER() OVER (
          PARTITION BY ar.id_animalid 
          ORDER BY DATE(ar.registration_date) DESC
        ) AS rn
      FROM animal_registration_table ar
      WHERE ar.registration_date IS NOT NULL
    )

    SELECT 
      a.id_animalid, 
      a.animal_name, 
      a.birth_date, 
      a.death_date,
      s.sex_name,
      bt.birth_type,
      sire.animal_name AS sire_name,
      dam.animal_name AS dam_name,
      fp_animal.flock_prefix AS animal_flock_prefix,
      fp_sire.flock_prefix AS sire_flock_prefix,
      fp_dam.flock_prefix AS dam_flock_prefix,

      lr.registration_number AS registration_number,
      lr.registration_date AS registration_date,

      (
        SELECT ai.id_number
        FROM animal_id_info_table ai
        WHERE 
          ai.id_animalid = a.id_animalid
          AND ai.official_id = '1'
          AND (ai.id_date_off IS NULL OR ai.id_date_off = '')
        ORDER BY ai.id_date_on DESC
        LIMIT 1
      ) AS latestOfficialID,

      (
        SELECT ai.id_number
        FROM animal_id_info_table ai
        WHERE 
          ai.id_animalid = a.id_animalid
          AND ai.id_idtypeid = '6af3845e-0abc-4afa-bcb4-4eea96f2ecc2'
          AND (ai.id_date_off IS NULL OR ai.id_date_off = '')
        ORDER BY ai.id_date_on DESC
        LIMIT 1
      ) AS latestFarmID

    FROM animal_table a
    JOIN sex_table s ON a.id_sexid = s.id_sexid
    JOIN birth_type_table bt ON a.id_birthtypeid = bt.id_birthtypeid

    LEFT JOIN animal_table sire ON a.sire_id = sire.id_animalid
    LEFT JOIN animal_flock_prefix_table afp_sire ON afp_sire.id_animalid = sire.id_animalid
    LEFT JOIN flock_prefix_table fp_sire ON fp_sire.id_flockprefixid = afp_sire.id_flockprefixid

    LEFT JOIN animal_table dam ON a.dam_id = dam.id_animalid
    LEFT JOIN animal_flock_prefix_table afp_dam ON afp_dam.id_animalid = dam.id_animalid
    LEFT JOIN flock_prefix_table fp_dam ON fp_dam.id_flockprefixid = afp_dam.id_flockprefixid

    LEFT JOIN animal_flock_prefix_table afp_animal ON afp_animal.id_animalid = a.id_animalid
    LEFT JOIN flock_prefix_table fp_animal ON fp_animal.id_flockprefixid = afp_animal.id_flockprefixid

    LEFT JOIN latest_registration lr ON lr.id_animalid = a.id_animalid AND lr.rn = 1
  `;

  const conditions: string[] = [];
  const values: any[] = [];

  // Conditionally add WHERE clauses based on provided parameters
  if (queryParams.name) {
    const escapedName = escapeLikeString(queryParams.name);
    conditions.push("a.animal_name LIKE ?"); // using `a.animal_name` as it is ambiguous otherwise & the query fails ('a' MUST be referencing `FROM animal_table a` in the `animalQuery`)
    values.push(`%${escapedName}%`);
  }

  if (queryParams.registrationNumber) {
    const escapedRegNum = escapeLikeString(queryParams.registrationNumber);
    conditions.push("lr.registration_number LIKE ?");
    values.push(`%${escapedRegNum}%`);
  }

  if (queryParams.registrationType) {
    conditions.push("a.registration_type = ?");
    values.push(queryParams.registrationType);
  }

  if (queryParams.birthStartDate) {
    conditions.push("a.birth_date >= ?");
    values.push(queryParams.birthStartDate);
  }

  if (queryParams.birthEndDate) {
    conditions.push("a.birth_date <= ?");
    values.push(queryParams.birthEndDate);
  }

  if (queryParams.deathStartDate) {
    conditions.push("a.death_date >= ?");
    values.push(queryParams.deathStartDate);
  }

  if (queryParams.deathEndDate) {
    conditions.push("a.death_date <= ?");
    values.push(queryParams.deathEndDate);
  }

  // Filter by federal tag
  if (queryParams.federalTag) {
    const escapedTag = escapeLikeString(queryParams.federalTag);
    conditions.push(`
      EXISTS (
        SELECT 1 FROM animal_id_info_table ai
        WHERE 
          ai.id_animalid = a.id_animalid
          AND ai.official_id = '1'
          AND (ai.id_date_off IS NULL OR ai.id_date_off = '')
          AND ai.id_number = ?
      )
    `);
    values.push(`${escapedTag}`);
  }

  // Filter by farm tag
  if (queryParams.farmTag) {
    const escapedTag = escapeLikeString(queryParams.farmTag);
    conditions.push(`
      EXISTS (
        SELECT 1 FROM animal_id_info_table ai
        WHERE 
          ai.id_animalid = a.id_animalid
          AND ai.id_idtypeid = '6af3845e-0abc-4afa-bcb4-4eea96f2ecc2'
          AND (ai.id_date_off IS NULL OR ai.id_date_off = '')
          AND ai.id_number = ?
      )
    `);
    values.push(`${escapedTag}`);
  }

  if (queryParams.isAlreadyPrinted === true) {
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM registry_certificate_print_table rcp
        WHERE rcp.id_animalid = a.id_animalid
        AND rcp.printed = 1
      )
    `);
  } else if (queryParams.isAlreadyPrinted === false) {
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM registry_certificate_print_table rcp
        WHERE rcp.id_animalid = a.id_animalid
        AND rcp.printed = 0
      )
    `);
  }

  // Append conditions to the query
  if (conditions.length > 0) {
    animalQuery += " WHERE " + conditions.join(" AND ");
  }

  // Add limit for safety
  animalQuery += " LIMIT 20";

  return new Promise((resolve, reject) => {
    db.all(animalQuery, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map rows to Animal objects
        const animals = rows.map((row: any) => ({
          animal_id: row.id_animalid,
          flockPrefix: row.animal_flock_prefix,
          name: row.animal_name,
          registration: row.registration_number,
          birthDate: row.birth_date,
          deathDate: row.death_date || null,
          sex: row.sex_name,
          birthType: row.birth_type,
          latestOfficialID: row.latestOfficialID || null,
          latestFarmID: row.latestFarmID || null,
          sireFlockPrefix: row.sire_flock_prefix || null,
          sireName: row.sire_name,
          damFlockPrefix: row.dam_flock_prefix || null,
          damName: row.dam_name,
        })) as AnimalSearchResult[];

        resolve(animals);
      }
    });
  });
};