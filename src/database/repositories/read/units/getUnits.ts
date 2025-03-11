import { Database } from "sqlite3";
import { getDatabase } from "../../../dbConnections.js";
import { UnitQueryParameters, UnitInfo } from "../../../models/read/units/unit.js";

export const getUnits = async (queryParams: UnitQueryParameters): Promise<UnitInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  if (queryParams.unit_type_id != null) {
    return getUnitsByUnitTypeId(db, queryParams.unit_type_id);
  } else if (queryParams.unit_type_name != null) {
    return getUnitsByUnitTypeName(db, queryParams.unit_type_name);
  } else {
    return getAllunits(db);
  }
};

// Get Units based on the unit type
const getUnitsByUnitTypeId = (db: Database, id: string): Promise<UnitInfo[]> => {
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
const getUnitsByUnitTypeName = (db: Database, unit_type_name: string): Promise<UnitInfo[]> => {
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
const getAllunits = (db: Database): Promise<UnitInfo[]> => {
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
const executeQuery = (db: any, query: string, params: any[]): Promise<UnitInfo[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err: any, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        const results: UnitInfo[] = rows.map((row: any) => ({
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