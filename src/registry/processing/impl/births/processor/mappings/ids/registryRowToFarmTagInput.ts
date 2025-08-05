import { AnimalIdInfoInput } from "../../../../../../../database/index";
import { RegistryRow } from "../../../../../core/types";
import { isUUIDv4 } from "../../../../../helpers/registryHelpers";

export function mapRegistryRowToFarmTagInput(row: RegistryRow, animalId : string): AnimalIdInfoInput {

  if (!isUUIDv4(row.farmTypeKey)) {
    throw new Error("farmTypeKey is not a UUIDv4 key: " + row.farmTypeKey);
  }

  if (!isUUIDv4(row.farmColorKey)) {
    throw new Error("farmColorKey is not a UUIDv4 key: " + row.farmColorKey);
  }

  if (!isUUIDv4(row.farmLocKey)) {
    throw new Error("farmLocKey is not a UUIDv4 key: " + row.farmLocKey);
  }

  return {
    animalId: animalId,
    idType: row.farmTypeKey,
    idColor: row.farmColorKey,
    idLocation: row.farmLocKey,
    dateOn: row.birthdate,
    idValue: row.farmNum,
    isOfficial: false,
    idScrapieFlock: null, // farm tags have no scrapie flock IDs because they are not official
  };
}
