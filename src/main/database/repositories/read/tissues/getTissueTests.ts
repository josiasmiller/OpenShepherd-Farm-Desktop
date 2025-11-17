import {Database} from "sqlite3";
import { TissueTest } from '@app/api';
import { Result, Success, Failure } from "@common/core";

/**
 * gets all tissue tests from the DB
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of `TissueTest` objects on success, 
 *          or a string error message on failure.
 */
export const getTissueTests = async (db: Database): Promise<Result<TissueTest[], string>> => {

  let ttQuery = `
    SELECT 
        id_tissuetestid AS id, 
        tissue_test_name AS name,
        tissue_test_display_order as display_order
    FROM tissue_test_table`;

  return new Promise<Result<TissueTest[], string>>((resolve) => {
    db.all(ttQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(err.message)); // Return Failure with the error message
      } else {
        const results: TissueTest[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));
        resolve(new Success(results)); // Return Success with the data
      }
    });
  });
};
