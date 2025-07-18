import { InsertAnimalTableInput } from "../../../../../database/index.js";
import { RegistryRow } from "../../../core/types";

export function mapRegistryRowToInsertAnimalInput(row: RegistryRow): InsertAnimalTableInput {
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
