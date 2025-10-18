import {Database} from "sqlite3";
import { getDbDate } from "../../../../dbUtils";
import { Result, Success, Failure } from "packages/core";
import { PedigreeNode } from "packages/api";

type PedigreeRow = {
  animalId: string;
  sireId: string | null;
  damId: string | null;
  flockPrefix: string | null;
  animalName: string;
  registrationNumber: string | null;
  sexName: string | null;
  birthDate: string | null;
  birthType: string | null;
  birthTypeAbbrev: string | null;
};

/**
 * recursively retrieves the pedigree information of an animal.
 * @param db The Database to act on
 * @param animalId UUID of animal being sought
 * @param depth how deep in the search this iteration is
 * @returns A `Result` containing a `PedigreeNode` object or `null` on success, 
 *          or a string error message on failure.
 */
export const getPedigree = async (
  db: Database,
  animalId: string,
  depth: number
): Promise<Result<PedigreeNode | null, string>> => {

  if (depth < 0) {
    return new Success(null); // Base case: stop recursion
  }

  const query = `
    SELECT 
      a.id_animalid AS animalId,
      a.sire_id AS sireId,
      a.dam_id AS damId,
      fr.flock_prefix AS flockPrefix,
      a.animal_name AS animalName,
      ar.registration_number AS registrationNumber,
      s.sex_name AS sexName,
      a.birth_date AS birthDate,
      bt.birth_type AS birthType,
      bt.birth_type_abbrev AS birthTypeAbbrev
    FROM animal_table a
    LEFT JOIN animal_registration_table ar 
      ON ar.id_animalid = a.id_animalid 

    LEFT JOIN animal_flock_prefix_table afp 
      ON afp.id_animalid = a.id_animalid
    LEFT JOIN flock_prefix_table fr 
      ON fr.id_flockprefixid = afp.id_flockprefixid
    LEFT JOIN sex_table s 
      ON s.id_sexid = a.id_sexid
    LEFT JOIN birth_type_table bt 
      ON bt.id_birthtypeid = a.id_birthtypeid
    WHERE a.id_animalid = ?
    ORDER BY ar.registration_date DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], async (err, row: PedigreeRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database error: ${err.message}`));
        return;
      }

      if (!row) {
        resolve(new Success(null)); // No record found
        return;
      }

      const resolvePedigreeBranch = async (parentId: string | null): Promise<Result<PedigreeNode | null, string>> => {
        return parentId ? getPedigree(db, parentId, depth - 1) : new Success(null);
      };

      const [sireResult, damResult] = await Promise.all([
        resolvePedigreeBranch(row.sireId),
        resolvePedigreeBranch(row.damId),
      ]);

      if (sireResult instanceof Failure) {
        resolve(new Failure(`Failed to fetch sire (${row.sireId}): ${sireResult.error}`));
        return;
      }

      if (damResult instanceof Failure) {
        resolve(new Failure(`Failed to fetch dam (${row.damId}): ${damResult.error}`));
        return;
      }


      var bday : Date | null;

      if (row.birthDate) {
        bday = getDbDate(row.birthDate);
      } else {
        bday = new Date("1972-01-01");
      }        

      const pedigreeNode: PedigreeNode = {
        animalId: row.animalId,
        sirePedigree: sireResult.data,
        damPedigree: damResult.data,
        flockPrefix: row.flockPrefix,
        animalName: row.animalName,
        registrationNumber: row.registrationNumber,
        sexName: row.sexName,
        birthDate: bday,
        birthType: row.birthType,
        birthTypeAbbreviation: row.birthTypeAbbrev,
      };

      resolve(new Success(pedigreeNode));
    });
  });
};
