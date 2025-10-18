import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { TissueSampleContainerType } from "packages/api";

/**
 * gets all tissue sample container types from the DB
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of `TissueSampleContainerType` objects on success, 
 *          or a string error message on failure.
 */
export const getTissueSampleContainerTypes = async (db: Database): Promise<Result<TissueSampleContainerType[], string>> => {

  const tstQuery = `
    SELECT 
        id_tissuesamplecontainertypeid AS id, 
        tissue_sample_container_name AS name,
        tissue_sample_container_display_order as display_order
    FROM tissue_sample_container_type_table`;

  return new Promise((resolve) => {
    db.all(tstQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        const results: TissueSampleContainerType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};
