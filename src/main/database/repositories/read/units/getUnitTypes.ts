import {Database} from "sqlite3";
import { UnitType } from "packages/api";
import { Result, Success, Failure } from "packages/core";

/**
 * gets all unit types from the DB
 *
 * @param db The Database to act on
 * @returns A `Result` containing an array of `UnitType` objects on success, 
 *          or a string error message on failure.
 */
export const getUnitTypes = async (db: Database): Promise<Result<UnitType[], string>> => {

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