import { getDatabase } from "../../../../dbConnections.js";
import { FlockPrefix } from "../../../../models/read/animal/flocks/flockPrefix.js";
import { OwnerType } from "../../../../models/read/owners/ownerType.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

/**
 * gets all FlockPrefixes from the DB
 * @returns A `Result` containing an array of `FlockPrefix` objects on success, 
 *          or a string error message on failure.
 */
export const getFlockPrefixes = async (): Promise<Result<FlockPrefix[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let flockPrefixQuery = `
    SELECT 
        id_flockprefixid AS id, 
        flock_prefix AS name,
        id_prefixowner_id_contactid as owner_contact_id, 
        id_prefixowner_id_companyid as owner_company_id,
        id_registry_id_companyid as registry_id
    FROM flock_prefix_table`;

  return new Promise((resolve) => {
    db.all(flockPrefixQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Error fetching flock prefixes: ${err.message}`));
      } else {
        const results: FlockPrefix[] = rows
          .map((row: any) => {
            let owner_id: string;
            let owner_type: OwnerType;

            if (row.owner_contact_id) {
              owner_id = row.owner_contact_id;
              owner_type = OwnerType.CONTACT;
            } else if (row.owner_company_id) {
              owner_id = row.owner_company_id;
              owner_type = OwnerType.COMPANY;
            } else {
              return null; // filtered out later
            }

            return {
              id: row.id,
              name: row.name,
              owner_id,
              owner_type,
              registry_company_id: row.registry_id,
            };
          })
          .filter((item) => item !== null) as FlockPrefix[];

        resolve(new Success(results));
      }
    });
  });
};