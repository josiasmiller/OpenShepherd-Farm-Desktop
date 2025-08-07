import { getDatabase } from '../../../../dbConnections';
import { Result, Success, Failure } from '../../../../../shared/results/resultTypes';
import { FlockPrefix } from '../../../../models/read/animal/flocks/flockPrefix';
import { OwnerType } from '../../../../models/read/owners/ownerType';

/**
 * Gets the current flock prefix for a given animalId.
 *
 * @param animalId - The ID of the animal.
 * @returns Result<FlockPrefix, string> - Success with FlockPrefix if found, or Failure with error message.
 */
export async function getFlockPrefixByAnimalId(
  animalId: string
): Promise<Result<FlockPrefix, string>> {
  const db = getDatabase();
  if (!db) return new Failure('DB instance is null');

  const query = `
    SELECT
      aoh.to_id_contactid,
      aoh.to_id_companyid,
      fp.id_flockprefixid AS id,
      fp.flock_prefix AS name,
      fp.id_registry_id_companyid AS registry_company_id,
      fp.id_prefixowner_id_contactid,
      fp.id_prefixowner_id_companyid
    FROM animal_ownership_history_table aoh
    LEFT JOIN flock_prefix_table fp
      ON (
        (fp.id_prefixowner_id_contactid = aoh.to_id_contactid AND aoh.to_id_contactid IS NOT NULL)
        OR (fp.id_prefixowner_id_companyid = aoh.to_id_companyid AND aoh.to_id_companyid IS NOT NULL)
      )
    WHERE aoh.id_animalid = ?
    ORDER BY aoh.transfer_date DESC
    LIMIT 1
  `;

  try {
    const result: any = await new Promise((resolve, reject) => {
      db.get(query, [animalId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!result || (!result.id_prefixowner_id_contactid && !result.id_prefixowner_id_companyid)) {
      return new Failure('No current ownership or flock prefix found for this animal.');
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
