import {Database} from "sqlite3";
import { getDbDate } from "../../../../dbUtils";
import { Result, Success, Failure } from "@common/core";
import { idTag } from '@app/api';

type TagQueryRow = {
  tagId: string;
  animalId: string;
  idNumber: string;
  official: number;
  dateOn: string;
  timeOn: string;
  typeId: string;
  typeName: string;
  typeAbbrev: string | null;
  maleColorId: string;
  maleColorName: string;
  maleColorAbbrev: string | null;
  femaleColorId: string;
  femaleColorName: string;
  femaleColorAbbrev: string | null;
  locationId: string;
  locationName: string;
  locationAbbrev: string;
};

/**
 * gets the most recent offical tag of a given animal
 * @param db The Database to act on
 * @param animalId UUID of animal being sought
 * @returns A `Result` containing a`idTag` object or `null` on success, 
 *          or a string error message on failure.
 */
export const getMostRecentOfficialTag = async (
  db: Database, animalId: string
): Promise<Result<idTag | null, string>> => {

  const query = `
    SELECT
      ait.id_animalidinfoid AS tagId,
      ait.id_animalid AS animalId,
      ait.id_number AS idNumber,
      ait.official_id AS official,
      ait.id_date_on AS dateOn,
      ait.id_time_on AS timeOn,
      itt.id_idtypeid AS typeId,
      itt.id_type_name AS typeName,
      itt.id_type_abbrev AS typeAbbrev,
      mc.id_idcolorid AS maleColorId,
      mc.id_color_name AS maleColorName,
      mc.id_color_abbrev AS maleColorAbbrev,
      fc.id_idcolorid AS femaleColorId,
      fc.id_color_name AS femaleColorName,
      fc.id_color_abbrev AS femaleColorAbbrev,
      ilt.id_idlocationid AS locationId,
      ilt.id_location_name AS locationName,
      ilt.id_location_abbrev AS locationAbbrev
    FROM animal_id_info_table ait
    INNER JOIN id_type_table itt ON itt.id_idtypeid = ait.id_idtypeid
    INNER JOIN id_color_table mc ON mc.id_idcolorid = ait.id_male_id_idcolorid
    INNER JOIN id_color_table fc ON fc.id_idcolorid = ait.id_female_id_idcolorid
    INNER JOIN id_location_table ilt ON ilt.id_idlocationid = ait.id_idlocationid
    WHERE ait.id_animalid = ?
      AND ait.official_id = 1
      AND ait.id_date_off IS NULL
      AND ait.id_time_off IS NULL
    ORDER BY datetime(ait.id_date_on || 'T' || ait.id_time_on) DESC
    LIMIT 1;
  `;

  return new Promise((resolve) => {
    db.get<TagQueryRow>(query, [animalId], (err, row) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
        return;
      }

      if (!row) {
        resolve(new Success(null));
        return;
      }

      const dt: Date = getDbDate(row.dateOn) ?? new Date("1972-01-01");

      const tag: idTag = {
        id: row.tagId,
        isOfficial: row.official === 1,
        animalId: row.animalId,
        idNumber: row.idNumber,
        idType: {
          id: row.typeId,
          name: row.typeName,
          abbrev: row.typeAbbrev ?? null,
        },
        dateOn: dt,
        maleColor: {
          id: row.maleColorId,
          name: row.maleColorName,
          abbrev: row.maleColorAbbrev ?? null,
        },
        femaleColor: {
          id: row.femaleColorId,
          name: row.femaleColorName,
          abbrev: row.femaleColorAbbrev ?? null,
        },
        location: {
          id: row.locationId,
          name: row.locationName,
          abbrev: row.locationAbbrev,
        },
      };

      resolve(new Success(tag));
    });
  });
};
