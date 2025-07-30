import { getDatabase } from "../../../../dbConnections.js";
import { DrugEvent } from "../../../../models/read/animal/drugs/drugEvent.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

/**
 * gets the drug history of a given animal
 * @param animalId UUID of the animal being sought
 * @returns A `Result` containing an array of `DrugEvent` objects on success, 
 *          or a string error message on failure.
 */
export const getDrugHistory = async (animalId : string): Promise<Result<DrugEvent[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let drugEventsQuery = `
    SELECT
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

    WHERE ad.id_animalid = ?;
  `;


  return new Promise((resolve, reject) => {
    db.all(drugEventsQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: DrugEvent[] = rows.map((row: any) => ({
            drugHistoryId: row.id_druglotid,
            animalId: animalId,
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