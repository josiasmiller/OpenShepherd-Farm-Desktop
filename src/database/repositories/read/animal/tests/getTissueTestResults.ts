import { getDatabase } from "../../../../dbConnections.js";
import { TissueTestResult } from "../../../../models/read/animal/tests/tissueTestResult.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

/**
 * gets all tissue test result information for a given animal
 * @param animalId UUID of animal being sought
 * @returns A `Result` containing an array of `TissueTestResult` objects on success, 
 *          or a string error message on failure.
 */
export const getTissueTestResults = async (animalId : string): Promise<Result<TissueTestResult[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let tissueTestResultsQuery = `
    SELECT 
      animal_table.id_animalid
      , animal_tissue_sample_taken_table.tissue_sample_date
      , animal_tissue_sample_taken_table.tissue_sample_time
      , tissue_sample_type_table.tissue_sample_type_name
      , tissue_test_table.tissue_test_name
      , company_table.company
      , animal_tissue_test_request_table.tissue_test_results_date
      , animal_tissue_test_request_table.tissue_test_results_time
      , animal_tissue_test_request_table.tissue_test_results
    FROM animal_table
    INNER JOIN animal_tissue_sample_taken_table ON animal_tissue_sample_taken_table.id_animalid = animal_table.id_animalid

    INNER JOIN tissue_test_table ON tissue_test_table.id_tissuetestid = animal_tissue_test_request_table.id_tissuetestid
    INNER JOIN tissue_sample_type_table ON tissue_sample_type_table.id_tissuesampletypeid = animal_tissue_sample_taken_table.id_tissuesampletypeid 
    INNER JOIN animal_tissue_test_request_table ON animal_tissue_test_request_table.id_animaltissuesampletakenid = animal_tissue_sample_taken_table.id_animaltissuesampletakenid
    INNER JOIN company_laboratory_table ON company_laboratory_table.id_companylaboratoryid = animal_tissue_test_request_table.id_companylaboratoryid
    INNER JOIN company_table ON company_table.id_companyid = company_laboratory_table.id_companyid
    WHERE 
      animal_table.id_animalid = ?
    ORDER BY 
      animal_tissue_sample_taken_table.tissue_sample_date
      , animal_tissue_sample_taken_table.tissue_sample_time
    `;

  return new Promise((resolve, reject) => {
    db.all(tissueTestResultsQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: TissueTestResult[] = rows.map((row: any) => ({
          animalId: row.id_animalid,
          tissueSampleDate: row.tissue_sample_date,
          tissueSampleTime: row.tissue_sample_time,
          tissueSampleTypeName: row.tissue_sample_type_name,
          tissueSampleTestName: row.tissue_test_name,
          company: row.company,
          tissueTestResultsDate: row.tissue_test_results_date,
          tissueTestResultsTime: row.tissue_test_results_time,
          tissueTestResults: row.tissue_test_results,
        }));

        resolve(new Success(results));
      }
    });
  });
};