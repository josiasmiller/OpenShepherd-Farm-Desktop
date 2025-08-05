import { getDatabase } from "../../../dbConnections";
import { getPremiseSpecific } from "./getPremiseSpecific"; // Adjust import path if necessary
import { Premise } from "../../../models/read/premises/premise";
import { Result, Failure } from "../../../../shared/results/resultTypes";

/**
 * gets the premise for a given company
 * @param companyId UUID of the company being sought
 * @returns A `Result` containing a `Premise` object on success, 
 *          or a string error message on failure.
 */
export const getCompanyPremise = async (companyId: string): Promise<Result<Premise, string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const companyPremiseQuery = `
    SELECT 
      id_premiseid
    FROM 
      company_premise_table
    WHERE 
      id_companyid = ?
    ORDER BY 
      start_premise_use DESC
    LIMIT 1`;

  return new Promise((resolve) => {
    db.get(companyPremiseQuery, [companyId], async (err, row: { id_premiseid: string } | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No premise found for company ID: ${companyId}`));
      } else {
        const result = await getPremiseSpecific(row.id_premiseid);
        resolve(result);
      }
    });
  });
};
