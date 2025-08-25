import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";
import { Company } from "packages/api";

/**
 * gets companies from the DB, either all companies or just the registry companies
 * @param onlyGetRegistryCompanies bool indicating if the function should only get the registry companies
 * @returns A `Result` containing an array of `Company` objects on success, 
 *          or a string error message on failure.
 */
export const getCompanies = async (onlyGetRegistryCompanies: boolean): Promise<Result<Company[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let companyQuery: string;

  if (onlyGetRegistryCompanies) {
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

  return new Promise((resolve) => {
    db.all(companyQuery, [], (err, rows) => {
      if (err) {
        // If there's an error with the query, return Failure with the error message
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        // If successful, map the results into Company[] and return Success
        const results: Company[] = rows.map((row: any) => ({
          id: row.company_id,
          name: row.name,
          registry_id: row.registry_info_id,
        }));

        resolve(new Success(results));
      }
    });
  });
};
