import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "packages/core";

type ScrapieRow = {
  id_scrapieflockownerid: string;
};

export const getScrapieFlockId = async (
  contactId: string | null,
  companyId: string | null
): Promise<Result<string, string>> => {

  // saving this as it is good to have but its not yet implemented or functional!
  return new Failure("Not Implemented Yet");

  // const db = await getDatabase();
  // if (!db) {
  //   return new Failure("DB instance is null");
  // }

  // const query = `
  //   SELECT 
  //     id_scrapieflockownerid
  //   FROM 
  //     scrapie_flock_owner_table
  //   WHERE 
  //     owner_id_contactid = ? OR owner_id_companyid = ?
  //   LIMIT 1;
  // `;

  // return new Promise((resolve) => {
  //   db.get(query, [contactId, companyId], (err, row: ScrapieRow | undefined) => {
  //     if (err) {
  //       resolve(new Failure(`Database query failed: ${err.message}`));
  //     } else if (!row) {
  //       resolve(new Failure("No scrapie flock ID found for given owner."));
  //     } else {
  //       resolve(new Success(row.id_scrapieflockownerid));
  //     }
  //   });
  // });
};
