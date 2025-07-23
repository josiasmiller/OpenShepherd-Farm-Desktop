import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";
import { ScrapieFlockInfo } from "../../../models/read/scrapie/scrapieFlockInfo";

type RawScrapieRow = {
  id_scrapieflocknumberid: string;
  scrapie_flockid: string;
};

export const getScrapieFlockInfo = async (
  ownerId: string,
  isCompany: boolean
): Promise<Result<ScrapieFlockInfo | null, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB instance is null");
  }

  const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

  const query = `
    SELECT
      sfn.id_scrapieflocknumberid,
      sfn.scrapie_flockid
    FROM scrapie_flock_owner_table sfo
    JOIN scrapie_flock_number_table sfn ON sfn.id_scrapieflocknumberid = sfo.id_scrapieflocknumberid
    WHERE
      ${isCompany ? "sfo.owner_id_companyid = ?" : "sfo.owner_id_contactid = ?"}
      AND date(sfo.start_scrapie_flock_use) <= date(?)
      AND (sfo.end_scrapie_flock_use IS NULL OR date(sfo.end_scrapie_flock_use) >= date(?))
    ORDER BY sfo.start_scrapie_flock_use DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [ownerId, today, today], (err, row: RawScrapieRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
        return;
      }

      if (!row) {
        resolve(new Success(null));
        return;
      }

      const result: ScrapieFlockInfo = {
        flockNumberId: row.id_scrapieflocknumberid,
        scrapieName: row.scrapie_flockid,
      };

      resolve(new Success(result));
    });
  });
};
