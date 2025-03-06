import { getDatabase } from "../../../../dbConnections.js";
import { FlockPrefixInfo } from "../../../../models/read/animal/flocks/flockPrefix.js";

export const getFlockPrefixes = async (): Promise<FlockPrefixInfo[]> => {
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
        const results: FlockPrefixInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          owner_contact_id: row.owner_contact_id,
          owner_company_id: row.owner_company_id,
          registry_company_id: row.registry_id,
        }));

        resolve(results);
      }
    });
  });
};