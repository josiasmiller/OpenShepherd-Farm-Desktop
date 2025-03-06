import { getDatabase } from "../../../dbConnections.js";
import { CompanyInfo } from "../../../models/read/owners/company.js";

export const getCompanies = async (): Promise<CompanyInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let companyQuery = `
    SELECT 
        id_companyid AS company_id, 
        company AS name
    FROM 
        company_table`;

  return new Promise((resolve, reject) => {
    db.all(companyQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: CompanyInfo[] = rows.map((row: any) => ({
          id: row.company_id,
          name: row.name,
        }));

        resolve(results);
      }
    });
  });
};