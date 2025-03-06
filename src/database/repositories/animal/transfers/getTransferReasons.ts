import { getDatabase } from "../../../dbConnections.js";
import { TransferReasonInfo } from "../../../models/animal/transfers/transferReaon.js";

export const getTransferReasons = async (): Promise<TransferReasonInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let trQuery = `
    SELECT 
        id_transferreasonid AS id, 
        transfer_reason AS name,
        transfer_reason_display_order as display_order
    FROM transfer_reason_table`;

  return new Promise((resolve, reject) => {
    db.all(trQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: TransferReasonInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};