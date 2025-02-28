import { getDatabase } from "../../dbConnections.js";
import { PremiseInfo } from "../../models/premises/premise.js";

export const getPremises = async (): Promise<PremiseInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let premiseQuery = `
    SELECT 
        p.id_premiseid AS premise_id, 
        p.premise_address1 AS address_one,
        p.premise_city AS city,
        p.premise_postcode AS postcode,
        c.country_name AS country_name
    FROM 
        premise_table p
    JOIN 
        country_table c ON p.premise_id_countryid = c.id_countryid`;


  return new Promise((resolve, reject) => {
    db.all(premiseQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {

        const results: PremiseInfo[] = rows.map((row: any) => ({
          id: row.premise_id,
          address: row.address_one,
          city: row.city,
          postcode: row.postcode,
          country: row.country_name,
        }));

        resolve(results);
      }
    });
  });
};