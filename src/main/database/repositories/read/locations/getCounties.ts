import { getDatabase } from "../../../dbConnections";
import { County } from "packages/api";
import { Result, Success, Failure } from "packages/core";

/**
 * gets all counties from the DB
 * @returns A `Result` containing an array of `County` objects on success, 
 *          or a string error message on failure.
 */
export const getCounties = async (): Promise<Result<County[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let countyQuery = `
    SELECT 
        id_countyid AS id, 
        county_name AS name,
        id_stateid as state_id 
    FROM county_table`;

  return new Promise((resolve) => {
    db.all(countyQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else {
        const results: County[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          state_id: row.state_id,
        }));

        resolve(new Success(results));
      }
    });
  });
};