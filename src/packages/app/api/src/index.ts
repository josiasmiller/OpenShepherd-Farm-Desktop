import { AnimalTrakkerIPC } from "./apis";

export {
  AnimalDeath,
  AnimalDetails,
  AnimalIdentification,
  AnimalIdInfoInput,
  AnimalNote,
  AnimalRegistrationResult,
  AnimalRow,
  AnimalSearchRequest,
  AnimalSearchResult,
  BirthInfo,
  BirthType,
  BirthParseRow,
  BirthParseResponse,
  Breed,
  BreedRequest,
  CoatColor,
  CodonResponse,
  Color,
  Company,
  Contact,
  Country,
  County,
  DatabaseSessionInfo,
  DatabaseStateCheckResponse,
  DeathReason,
  DeathRecord,
  DefaultSettingsResults,
  DrugEvent,
  ExistingMemberBuyer,
  FlockPrefix,
  idTag,
  idType,
  idColor,
  idLocation,
  NewBuyer,
  ParseResult,
  Premise,
  RegistryType,
  RegistryProcessType,
  RegistryProcessRequest,
  RegistrationParseResponse,
  RemoveReason,
  SellerInfo,
  Sex,
  Species,
  State,
  TagLocation,
  TagType,
  TissueSampleContainerType,
  TissueSampleType,
  TissueTest,
  TransferReason,
  TransferRecord,
  Unit,
  UnitRequest,
  UnitType,
  NewDefaultSettingsParameters,
  PedigreeNode,
  ScrapieFlockInfo,
  ProcessingResult,
  RegistryCertificate,
  RegistryRow,
  RegistryFieldDef,
  RegistrationWriteResponse,
  RegistrationParseRow,
  Owner,
  OwnerType,
  OwnerContact,
  OwnerCompany,
  TissueTestResult,
  ValidationResult,
  ValidationResponse
} from "./dtos";

export type {
  AnimalTrakkerIPC,
  SystemAPI,
  AnimalAPI,
  DefaultsAPI,
  ExportAPI,
  LookupAPI,
  RegistryAPI,
  StoreAPI
} from "./apis"

export {
  DIALOG_CANCELLED,
  MISSING_FIELDS,
  PARSE_ERROR,
} from "./errorCodes/genericCodes"

export {
  DeathError
} from "./errorCodes/registryProcessing/deathCodes"

export {
  NEW_BUYER_NOT_SUPPORTED,
  TransferError,
} from "./errorCodes/registryProcessing/transferCodes"

export type {
  DialogCancelledError,
  MissingFieldsError,
  ParseError,
} from "./errorCodes/genericCodes";

export type {
  NewBuyerNotSupportedError
} from "./errorCodes/registryProcessing/transferCodes";

declare global {
  interface Window extends AnimalTrakkerIPC {}
}
