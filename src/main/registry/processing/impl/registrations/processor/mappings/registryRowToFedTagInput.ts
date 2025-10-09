import { RegistryRow } from "packages/api";
import { AnimalIdInfoInput } from "../../../../../../database";
import { isUUIDv4 } from "packages/core/src";

export function mapRegistryRowToFedTagInput(row: RegistryRow, animalId : string, scrapieId : string | null): AnimalIdInfoInput {

  if (!isUUIDv4(row.fedTypeKey)) {
    throw new Error("fedTypeKey is not a UUIDv4 key: " + row.fedTypeKey);
  }

  if (!isUUIDv4(row.fedColorKey)) {
    throw new Error("fedColorKey is not a UUIDv4 key: " + row.fedColorKey);
  }

  if (!isUUIDv4(row.fedLocKey)) {
    throw new Error("fedLocKey is not a UUIDv4 key: " + row.fedLocKey);
  }

  return {
    animalId: animalId,
    idType: row.fedTypeKey,
    idColor: row.fedColorKey,
    idLocation: row.fedLocKey,
    dateOn: row.birthdate,
    idValue: row.fedNum,
    isOfficial: true,
    idScrapieFlock: scrapieId,
  };
}
