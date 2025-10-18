import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { TransferReason } from "packages/api";

/**
 * gets all transfer reasons from the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `TransferReason` objects on success, 
 *          or a string error message on failure.
 */
export const getTransferReasons = async (db: Database): Promise<Result<TransferReason[], string>> => {

  let trQuery = `
    SELECT 
        id_transferreasonid AS id, 
        transfer_reason AS name,
        transfer_reason_display_order as display_order
    FROM transfer_reason_table`;

  return new Promise((resolve) => {
    db.all(trQuery, [], (err, rows) => {
      if (err) {
        resolve(new Failure(err.message));  // return the error message
      } else {
        const results: TransferReason[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));
        resolve(new Success(results)); // return the result wrapped in Success
      }
    });
  });
};