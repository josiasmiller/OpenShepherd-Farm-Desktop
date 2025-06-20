import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { PedigreeNode } from "../../../../models/read/animal/pedigree/pedigree.js";
import { REGISTRATION_REGISTERED } from "../../../../dbConstants.js";
import { getDbDate } from "../../../../dbUtils.js";

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
};


export const getPedigree = async (
  animalId: string,
  depth: number
): Promise<Result<PedigreeNode | null, string>> => {
  if (depth < 0) {
    return new Success(null); // Base case: stop recursion
  }

  const db = await getDatabase();
  if (!db) {
    return new Failure("DB Instance is null");
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
      bt.birth_type AS birthType
    FROM animal_table a
    LEFT JOIN animal_registration_table ar 
      ON ar.id_animalid = a.id_animalid 
      AND ar.id_animalregistrationtypeid = ?
    LEFT JOIN animal_flock_prefix_table afp 
      ON afp.id_animalid = a.id_animalid
    LEFT JOIN flock_prefix_table fr 
      ON fr.id_flockprefixid = afp.id_flockprefixid
    LEFT JOIN sex_table s 
      ON s.id_sexid = a.id_sexid
    LEFT JOIN birth_type_table bt 
      ON bt.id_birthtypeid = a.id_birthtypeid
    WHERE a.id_animalid = ?
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [REGISTRATION_REGISTERED, animalId], async (err, row: PedigreeRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database error: ${err.message}`));
        return;
      }

      if (!row) {
        resolve(new Success(null)); // No record found
        return;
      }

      const resolvePedigreeBranch = async (parentId: string | null): Promise<Result<PedigreeNode | null, string>> => {
        return parentId ? getPedigree(parentId, depth - 1) : new Success(null);
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

      let birthDateFormatted: string | null = null;

      if (row.birthDate) {
        const date = getDbDate(row.birthDate);

        if (!isNaN(date.getTime())) {
          birthDateFormatted = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }); // e.g., "19 Apr 2007"
        }
      }

      // Join flockPrefix and animalName with a space instead of comma
      const namePart = [row.flockPrefix, row.animalName]
        .filter((part) => part && part.trim() !== "")
        .join(" "); // space instead of comma

      // Other fields joined with commas
      const otherParts = [
        row.registrationNumber,
        row.sexName,
        birthDateFormatted,
        row.birthType,
      ].filter((part) => part && part.trim() !== "")
        .join(", ");

      // Final registryName
      const registryName = [namePart, otherParts]
        .filter((part) => part && part.trim() !== "")
        .join(", ");

      const pedigreeNode: PedigreeNode = {
        animalId: row.animalId,
        sirePedigree: sireResult.data,
        damPedigree: damResult.data,
        registryName:registryName,
      };

      resolve(new Success(pedigreeNode));
    });
  });
};
