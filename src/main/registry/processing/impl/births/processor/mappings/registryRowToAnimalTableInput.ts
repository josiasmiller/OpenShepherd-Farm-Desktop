import { BirthType, RegistryRow } from 'packages/api';
import { InsertAnimalTableInput } from '../../../../../../database';
import { isUUIDv4 } from 'packages/core';


export function mapRegistryRowToInsertAnimalInput(row: RegistryRow, birthType: BirthType): InsertAnimalTableInput {

  if (!isUUIDv4(row.sexKey)) {
    throw new Error("sexKey is not a UUIDv4 key: " + row.sexKey);
  }

  if (!isUUIDv4(row.birthTypeKey)) {
    throw new Error("BirthTypeID is not a UUIDv4 key: " + row.birthTypeKey);
  }

  if (!isUUIDv4(row.weightUnitsKey)) {
    throw new Error("WeightKey is not a UUIDv4 key: " + row.weightUnitsKey);
  }

  if (!isUUIDv4(row.sireId)) {
    throw new Error("sireId is not a UUIDv4 key: " + row.sireId);
  }

  if (!isUUIDv4(row.damId)) {
    throw new Error("damId is not a UUIDv4 key: " + row.damId);
  }

  var birthWeight : number | null = null;
  var birthWeightUnitsId : string | null = null;
  // Assign birthWeight if row.weight is a number
  if (typeof row.weight === 'number') {
    birthWeight = row.weight;
  }

  // Assign birthWeightUnitsId if row.weight_units_id is a string
  if (typeof row.weight_units_id === 'string') {
    birthWeightUnitsId = row.weight_units_id;
  }

  return {
    name: row.animalName,
    sexId: row.sexKey,
    birthdate: row.birthdate,
    birthTime: "00:00:00", // for now, set at midnight
    birthType: birthType,
    birthWeight: birthWeight,
    birthWeightUnitsId: birthWeightUnitsId,
    birthOrder: 1,
    rearType: null,
    weanedDate: null,
    deathDate: null,
    deathReasonId: null,
    sireId: row.sireId,
    damId: row.damId,
    fosterDamId: row.fosterDamId ?? null,
    surrogateDamId: row.surrogateDamId ?? null,
    handReared: row.handReared ?? false,
  };
}
