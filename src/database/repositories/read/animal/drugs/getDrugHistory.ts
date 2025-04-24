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
        flock_prefix_table.flock_prefix,
        a.animal_name,
        ad.id_druglotid,
        dl.drug_lot,
        d.trade_drug_name,
        d.generic_drug_name,
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
    JOIN drug_table d ON dl.id_drugid = d.id_drugid

    -- Join to get animal name and flock prefix
    JOIN animal_table a ON ad.id_animalid = a.id_animalid
    JOIN animal_flock_prefix_table afp ON afp.id_animalid = a.id_animalid
    JOIN flock_prefix_table ON flock_prefix_table.id_flockprefixid = afp.id_flockprefixid

    WHERE ad.id_animalid = ?;
  `;


  return new Promise((resolve, reject) => {
    db.all(drugHistoryQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: DrugHistory[] = rows.map((row: any) => ({
            id: row.id_druglotid,
            flockPrefix: row.flock_prefix,
            animalName: row.animal_name,
            tradeName: row.trade_drug_name,
            genericDrugName: row.generic_drug_name,
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