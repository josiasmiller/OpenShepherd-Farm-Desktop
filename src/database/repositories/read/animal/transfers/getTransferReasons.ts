import { getDatabase } from "../../../../dbConnections.js";
import { TransferReason } from "../../../../models/read/animal/transfers/transferReaon.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";


export const getTransferReasons = async (): Promise<Result<TransferReason[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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