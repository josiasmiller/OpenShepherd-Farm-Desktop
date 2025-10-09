import {Database} from "sqlite3";
import { Result, Success, Failure } from '@common/core';
import { OwnerType, FlockPrefix } from '@app/api';

/**
 * Gets the flock prefix for a given animalId by finding the registration record and matching breeder/registry in the flock_prefix_table.
 * @param db The Database to act on.
 * @param animalId - The ID of the animal.
 * @returns Result<FlockPrefix, string> - Success with FlockPrefix if found, or Failure with error message.
 */
export async function getFlockPrefixByAnimalIdFromRegistration(
  db: Database, animalId: string
): Promise<Result<FlockPrefix, string>> {

  const query = `
    SELECT
      ar.id_breeder_id_contactid,
      ar.id_breeder_id_companyid,
      ar.id_registry_id_companyid,
      fp.id_flockprefixid AS id,
      fp.flock_prefix AS name,
      fp.id_prefixowner_id_contactid,
      fp.id_prefixowner_id_companyid,
      fp.id_registry_id_companyid AS registry_company_id
    FROM animal_registration_table ar
    LEFT JOIN flock_prefix_table fp
      ON (
        (fp.id_prefixowner_id_contactid = ar.id_breeder_id_contactid AND ar.id_breeder_id_contactid IS NOT NULL)
        OR (fp.id_prefixowner_id_companyid = ar.id_breeder_id_companyid AND ar.id_breeder_id_companyid IS NOT NULL)
      )
      AND fp.id_registry_id_companyid = ar.id_registry_id_companyid
    WHERE ar.id_animalid = ?
      AND ar.id_registry_id_companyid IS NOT NULL
    LIMIT 1;
  `;

  try {
    const result: any = await new Promise((resolve, reject) => {
      db.get(query, [animalId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!result || !result.id) {
      return new Failure('No matching flock prefix found for this animal.');
    }

    const flockPrefix: FlockPrefix = {
      id: result.id,
      name: result.name,
      owner_id: result.id_prefixowner_id_contactid ?? result.id_prefixowner_id_companyid,
      owner_type: result.id_prefixowner_id_contactid ? OwnerType.CONTACT : OwnerType.COMPANY,
      registry_company_id: result.registry_company_id,
    };

    return new Success(flockPrefix);
  } catch (err: any) {
    return new Failure(`Failed to get flock prefix: ${err.message}`);
  }
}
