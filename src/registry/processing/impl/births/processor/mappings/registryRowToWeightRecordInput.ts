import { InsertWeightRecordInput } from "../../../../../../database/index.js";
import { RegistryRow } from "../../../../core/types.js";
import { isUUIDv4 } from "../../../../helpers/registryHelpers.js";

export function mapRegistryRowToWeightRecordInput(row: RegistryRow, animalId: string): InsertWeightRecordInput {

  if (!isUUIDv4(row.weightUnitsKey)) {
    throw new Error("WeightKey is not a UUIDv4 key: " + row.weightUnitsKey);
  }

  return {
    animalId: animalId,
    weight: row.weight,
    weightUnitId: row.weightUnitsKey,
    evalDate: row.birthdate,
    evalTime: "00:00:00", // for now we hard code no time
    ageInDays: 1, // for now, all BN are assumed to calculate brith weight at the DOB 
  }
}
