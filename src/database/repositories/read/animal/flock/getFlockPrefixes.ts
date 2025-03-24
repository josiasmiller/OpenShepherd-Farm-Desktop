import { getDatabase } from "../../../../dbConnections.js";
import { FlockPrefix } from "../../../../models/read/animal/flocks/flockPrefix.js";
import { OwnerType } from "../../../../models/read/owners/ownerType.js";

export const getFlockPrefixes = async (): Promise<FlockPrefix[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let flockPrefixQuery = `
    SELECT 
        id_flockprefixid AS id, 
        flock_prefix AS name,
        id_prefixowner_id_contactid as owner_contact_id, 
        id_prefixowner_id_companyid as owner_company_id,
        id_registry_id_companyid as registry_id
    FROM flock_prefix_table`;

  return new Promise((resolve, reject) => {
    db.all(flockPrefixQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: FlockPrefix[] = rows.map((row: any) => {
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
        .filter((item) => item !== null); // filter out any invalid rows

        resolve(results);
      }
    });
  });
};