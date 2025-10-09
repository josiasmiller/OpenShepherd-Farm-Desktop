import {Database} from "sqlite3";
import { DeathReason } from '@app/api';
import { Result, Success, Failure } from "@common/core";

/**
 * gets all death reasons from the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `DeathReason` objects on success, 
 *          or a string error message on failure.
 */
export const getDeathReasons = async (db: Database): Promise<Result<DeathReason[], string>> => {

  let deathReasonsQuery = `
    SELECT 
        id_deathreasonid AS id, 
        death_reason AS name,
        death_reason_display_order as display_order
    FROM death_reason_table`;

  return new Promise((resolve) => {
    db.all(deathReasonsQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(`Error fetching death reasons: ${err.message}`));
      } else {
        const results: DeathReason[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success(results));
      }
    });
  });
};