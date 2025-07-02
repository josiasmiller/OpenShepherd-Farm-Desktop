import { getDatabase } from "../../../dbConnections.js";
import { DeathReason } from "../../../models/read/deaths/deathReason.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";


export const getDeathReasons = async (): Promise<Result<DeathReason[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

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