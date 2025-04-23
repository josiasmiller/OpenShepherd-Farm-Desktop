import { getDatabase } from "../../../../dbConnections.js";
import { DrugHistory } from "../../../../models/read/animal/drugs/drugHistory.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";


export const getDrugHistory = async (animalId : string): Promise<Result<DrugHistory[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let drugHistoryQuery = `
    SELECT
      ad.id_druglotid,
      dl.drug_lot,
      ad.drug_date_on,
      ad.drug_time_on,
      ad.drug_date_off,
      ad.drug_time_off,
      ad.drug_dosage,
      ad.id_druglocationid,
      dloc.drug_location_name
    FROM animal_drug_table ad
    JOIN drug_lot_table dl ON ad.id_druglotid = dl.id_druglotid
    JOIN drug_location_table dloc ON ad.id_druglocationid = dloc.id_druglocationid
    WHERE ad.id_animalid = ?;
    `;

  return new Promise((resolve, reject) => {
    db.all(drugHistoryQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: DrugHistory[] = rows.map((row: any) => ({
            id: row.id_druglotid,
            drugLot: row.drug_lot,
            dateOn: row.drug_date_on,
            timeOn: row.drug_time_on,
            dateOff: row.drug_date_off,
            timeOff: row.drug_time_off,
            dosage: row.drug_dosage,
            locationId: row.id_druglocationid,
            locationName: row.drug_location_name,
        }));

        resolve(new Success(results));
      }
    });
  });
};