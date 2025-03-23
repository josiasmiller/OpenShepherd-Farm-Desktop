import { getDatabase } from "../../../dbConnections.js";
import { Owner } from "../../../models/read/owners/owner.js";

export const getOwners = async (): Promise<Owner[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let ownerQuery = `
    SELECT 
        id_contactid AS contact_id, 
        contact_first_name AS first_name, 
        contact_last_name AS last_name
    FROM 
        contact_table`;


  return new Promise((resolve, reject) => {
    db.all(ownerQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: Owner[] = rows.map((row: any) => ({
          id: row.contact_id,
          firstName: row.first_name,
          lastName: row.last_name,
        }));

        resolve(results);
      }
    });
  });
};