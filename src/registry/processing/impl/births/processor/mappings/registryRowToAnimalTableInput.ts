import { InsertAnimalTableInput } from "../../../../../../database/index.js";
import { RegistryRow } from "../../../../core/types.js";
import { isUUIDv4 } from "../../../../helpers/registryHelpers.js";

export function mapRegistryRowToInsertAnimalInput(row: RegistryRow): InsertAnimalTableInput {

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

  return {
    name: row.animalName,
    sexId: row.sexKey,
    birthdate: row.birthdate,
    birthTime: "00:00:00", // for now, set at midnight
    birthTypeId: row.birthTypeKey,
    birthWeight: row.weight,
    birthWeightUnitsId: row.weightUnitsKey,
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
