import { RegistryType } from '@app/api'

export function registryTypeToUuid(input : RegistryType): string {
  if (input == "black" || input == "badger face") {
    return REGISTRATION_REGISTERED;
  }

  if (input == "chocolate") {
    return REGISTRATION_CHOCOLATE_WELSH;
  }

  if (input == "white") {
    return REGISTRATION_WHITE_WELSH;
  }

  throw new Error(`Unhandled RegidstryType: \'${input}\'`);
}


// company registries
export const REGISTRY_COMPANY_ID = "3a7e2399-17fd-4a8f-af43-d66fde9e0539"; // ABWMSA
export const REGISTRY_CHOCOLATE_WMSA = "dc9ffa44-049c-4b34-8430-61a442bbe025"; // ACWMSA
export const REGISTRY_WHITE_WMSA = "d2122a99-b1c1-419f-8e18-28e1112dc7a8"; // AWWMSA

// evaluation_trait_table
export const EVALUATION_WEIGHT = "44d307ab-5c32-44c7-bb06-e65c11269716";

// registration_type_table
export const REGISTRATION_REGISTERED = "b434cd2d-93da-43d7-a930-7984abfa1788";
export const REGISTRATION_WHITE_WELSH = "af6322cc-7443-4053-9ba1-992ad052ad15";
export const REGISTRATION_CHOCOLATE_WELSH = "ec7ae46c-8ff7-44c5-8f9b-ba01b40245ba";
export const REGISTRATION_BIRTH_NOTIFY = "7b5175d0-13bd-49b3-96d3-2dd9809e125a";
export const REGISTRATION_DIED_AT_BIRTH = "28632033-cb77-4ca7-b7fb-8f24b369f013";

// transfer_reason_table
export const ID_TRANSFER_REASON_NATURAL_ADDITION = "58d08bf7-5d1f-4dda-80a7-009bbfe7084f";
export const ID_TRANSFER_REASON_TRANSFERRED_BREEDING = "2d3e0aed-84c9-48e8-b11f-00fad83288c6";

// death_reason_table
export const DIED_STILLBORN = "9de9f67c-afc4-4d16-83d3-20c4337f4344";

// genetic_characteristic_table
export const CHARACTERISTIC_COAT_COLOR = "0972486b-7b99-427e-b942-fa5ec88c2678";