import { getDatabase } from "../../../dbConnections.js";
import { CompanyInfo } from "../../../models/read/owners/company.js";

export const getCompanies = async (onlyGetRegistryCompanies : boolean): Promise<CompanyInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  var companyQuery: string;

  if (onlyGetRegistryCompanies) {
    // Get only companies that have a matching registry entry
    companyQuery = `
      SELECT 
          c.id_companyid AS company_id, 
          c.company AS name, 
          r.id_registryinfoid AS registry_info_id
      FROM 
          company_table c
      INNER JOIN 
          registry_info_table r ON c.id_companyid = r.id_companyid
    `;
  } else {
    // Get all companies, including those with or without a registry reference
    companyQuery = `
      SELECT 
          c.id_companyid AS company_id, 
          c.company AS name, 
          r.id_registryinfoid AS registry_info_id
      FROM 
          company_table c
      LEFT JOIN 
          registry_info_table r ON c.id_companyid = r.id_companyid
    `;
  }


  return new Promise((resolve, reject) => {
    db.all(companyQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: CompanyInfo[] = rows.map((row: any) => ({
          id: row.company_id,
          name: row.name,
          registry_id: row.registry_info_id,
        }));

        resolve(results);
      }
    });
  });
};