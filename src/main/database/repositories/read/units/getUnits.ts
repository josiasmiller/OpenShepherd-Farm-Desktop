import { Database } from "sqlite3";
import { UnitRequest, Unit } from "packages/api";
import { Result, Success, Failure } from "packages/core";

/**
 * gets all units for a given type of unit. When no parameters are given to this function, it retrieves all units
 * regardless of their type.
 *
 * @param db The Database to act on
 * @param queryParams 
 * @returns A `Result` containing an array of `Unit` objects on success, 
 *          or a string error message on failure.
 */
export const getUnits = async (db: Database, queryParams: UnitRequest): Promise<Result<Unit[], string>> => {
  try {

    if (queryParams.unit_type_id != null) {
      const dbResponse : Unit[] = await getUnitsByUnitTypeId(db, queryParams.unit_type_id);
      return new Success<Unit[]>(dbResponse);
    } else if (queryParams.unit_type_name != null) {
      const dbResponse : Unit[] = await getUnitsByUnitTypeName(db, queryParams.unit_type_name);
      return new Success<Unit[]>(dbResponse);
    } else {
      const dbResponse : Unit[] = await getAllUnits(db);
      return new Success<Unit[]>(dbResponse);
    }
  } catch (error) {
    return new Failure<string>(String(error)); // Return Failure if any error occurs during fetching
  }
};

// Get Units based on the unit type
const getUnitsByUnitTypeId = (db: Database, id: string): Promise<Unit[]> => {
  const query = `
    SELECT 
        id_unitsid AS id, 
        units_name AS name,
        id_unitstypeid as unit_type,
        units_display_order as display_order
    FROM units_table
    WHERE id_unitstypeid = ?`;

  return executeQuery(db, query, [id]);
};

// Get Units based on the unit type
const getUnitsByUnitTypeName = (db: Database, unit_type_name: string): Promise<Unit[]> => {
  const query = `
    SELECT 
        id_unitsid AS id, 
        units_name AS name,
        id_unitstypeid as unit_type,
        units_display_order as display_order
    FROM units_table
    WHERE id_unitstypeid = (
      SELECT id_unitstypeid FROM units_type_table utt WHERE utt.unit_type_name = ?
    )`;

  return executeQuery(db, query, [unit_type_name]);
};

// Get all units (default)
const getAllUnits = (db: Database): Promise<Unit[]> => {
  let unitTypeQuery = `
    SELECT 
        id_unitsid AS id, 
        units_name AS name,
        id_unitstypeid as unit_type,
        units_display_order as display_order
    FROM units_table`;

  return executeQuery(db, unitTypeQuery, []);
};

// Helper function to execute queries
const executeQuery = (db: any, query: string, params: any[]): Promise<Unit[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err: any, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        const results: Unit[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          unit_type: row.unit_type,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};