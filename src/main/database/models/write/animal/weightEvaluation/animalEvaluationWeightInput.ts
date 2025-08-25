export type InsertWeightRecordInput = {
  animalId: string;
  weight: number; // the REAL value
  weightUnitId: string; // UUID from units_table (e.g., LBS or KG)
  evalDate: string; // in YYYY-MM-DD format
  evalTime: string; // in HH:MM:SS format
  ageInDays: number;
}
