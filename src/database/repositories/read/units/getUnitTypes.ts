import { getDatabase } from "../../../dbConnections";
import { UnitType } from "../../../models/read/units/unitType";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes";


/**
 * gets all unit types from the DB
 * 
 * @returns A `Result` containing an array of `UnitType` objects on success, 
 *          or a string error message on failure.
 */
export const getUnitTypes = async (): Promise<Result<UnitType[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure<string>("DB Instance is null"); // Return Failure with string error message
  }

  let unitTypeQuery = `
    SELECT 
        id_unitstypeid AS id, 
        unit_type_name AS name,
        unit_type_display_order as display_order
    FROM units_type_table`;

  return new Promise((resolve, reject) => {
    db.all(unitTypeQuery, [], (err, rows) => {
      if (err) {
        reject(new Failure<string>("Error executing query")); // Return Failure with a specific error message
      } else {
        const results: UnitType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
        }));

        resolve(new Success<UnitType[]>(results)); // Return Success with UnitType[] if query succeeds
      }
    });
  });
};