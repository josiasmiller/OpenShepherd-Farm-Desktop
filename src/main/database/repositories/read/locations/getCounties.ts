import {Database} from "sqlite3";
import { County } from '@app/api';
import { Result, Success, Failure } from "@common/core";

/**
 * gets all counties from the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `County` objects on success, 
 *          or a string error message on failure.
 */
export const getCounties = async (db: Database): Promise<Result<County[], string>> => {

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