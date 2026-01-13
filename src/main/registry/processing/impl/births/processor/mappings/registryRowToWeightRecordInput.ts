import { BirthNotification } from '@app/api';
import { InsertWeightRecordInput } from '../../../../../../database';
import { isUUIDv4 } from '@common/core';

export function mapRegistryRowToWeightRecordInput(bn: BirthNotification, animalId: string): InsertWeightRecordInput {

  if (!isUUIDv4(bn.weightUnits.id)) {
    throw new Error("WeightKey is not a UUIDv4 key: " + bn.weightUnits.id);
  }

  return {
    animalId: animalId,
    weight: bn.weight,
    weightUnitId: bn.weightUnits.id,
    evalDate: bn.birthdate,
    evalTime: "00:00:00", // for now we hard code no time
    ageInDays: 1, // for now, all BN are assumed to calculate brith weight at the DOB 
  }
}
