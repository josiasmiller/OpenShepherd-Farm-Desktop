import {
  AnimalDetails,
  AnimalIdentification,
  AnimalSearchRequest,
  AnimalSearchResult,
  BirthType,
  Breed,
  BreedRequest,
  Color,
  Company,
  Contact,
  Country,
  County,
  DeathReason,
  DefaultSettingsResults,
  FlockPrefix,
  Premise,
  RemoveReason,
  Sex,
  Species,
  State,
  TagLocation,
  TagType,
  TissueSampleContainerType,
  TissueSampleType,
  TissueTest,
  Unit,
  UnitRequest,
  UnitType,
  NewDefaultSettingsParameters,
  PedigreeNode,
  ScrapieFlockInfo,
  RegistryProcessRequest,
  DatabaseStateCheckResponse,
  ParseResult,
  ProcessingResult,
  RegistrationWriteResponse,
  RegistrationParseResponse,
  OwnerType,
  Owner,
  BirthRecord,
  TransferRecord,
  DeathRecord,
  ProcessSuccess,
  ProcessFailure,
} from "./dtos";

import { Result, Fulfillment } from "@common/core";
import { type IpcEventRegistrarFunc } from "@ipc/core";

import {
  BirthError,
  DeathError,
  TransferError,
} from "./index";


// -------------------- Animal --------------------
export interface AnimalAPI {
  search: (params: AnimalSearchRequest) => Promise<AnimalSearchResult[]>;
  getIdentification: (animalId: string) => Promise<Result<AnimalIdentification[], string>>;
  getAnimalDetails: (animalIds: string[]) => Promise<Result<AnimalDetails[], string>>;
  getPedigree: (animalId: string) => Promise<Result<PedigreeNode, string>>;
}

// -------------------- Export --------------------
export interface ExportAPI {
  notesCsv: (animalIds: string[]) => Promise<boolean>;
  drugHistoryCsv: (animalIds: string[]) => Promise<boolean>;
  tissueTestResultsCsv: (animalIds: string[]) => Promise<boolean>;
  registration: (
    animalIds: string[],
    registrationType: "black" | "white" | "chocolate",
    signatureFilePath: string | null
  ) => Promise<RegistrationWriteResponse>;
}

// -------------------- Defaults --------------------
export interface DefaultsAPI {
  editExisting: (params: NewDefaultSettingsParameters) => Promise<boolean>;
  writeNew: (params: NewDefaultSettingsParameters) => Promise<boolean>;
  getExisting: () => Promise<Result<DefaultSettingsResults[], string>>;
  onDefaultSettingsListChanged: IpcEventRegistrarFunc<DefaultSettingsResults[]>
  selectActiveDefaultSettings: (params: DefaultSettingsResults) => Promise<void>
  queryActiveDefaultSettings: () => Promise<DefaultSettingsResults>
  onActiveDefaultSettingsChanged: IpcEventRegistrarFunc<DefaultSettingsResults>
  onActiveDefaultSettingsNotFound: IpcEventRegistrarFunc<string>
}

// -------------------- Lookup --------------------
export interface LookupAPI {
  getBirthTypes: () => Promise<Result<BirthType[], string>>;
  getBreeds: (params: BreedRequest) => Promise<Result<Breed[], string>>;
  getColors: () => Promise<Result<Color[], string>>;
  getCountries: () => Promise<Result<Country[], string>>;
  getCountryPrefixForOwner: (ownerId: string, isCompany: boolean) => Promise<Result<string, string>>;
  getCounties: () => Promise<Result<County[], string>>;
  getDeathReasons: () => Promise<Result<DeathReason[], string>>;
  getFlockPrefixes: () => Promise<Result<FlockPrefix[], string>>;
  getLocations: () => Promise<Result<TagLocation[], string>>;
  getOwnerById: (ownerId: string, OwnerType: OwnerType) => Promise<Result<Owner, string>>;
  getPremiseInfo: () => Promise<Result<Premise[], string>>;
  getRemoveReasons: () => Promise<Result<RemoveReason[], string>>;
  getSexes: () => Promise<Result<Sex[], string>>;
  getSpecies: () => Promise<Result<Species[], string>>;
  getStates: () => Promise<Result<State[], string>>;
  getTagTypes: () => Promise<Result<TagType[], string>>;
  getTissueSampleTypes: () => Promise<Result<TissueSampleType[], string>>;
  getTissueSampleContainerTypes: () => Promise<Result<TissueSampleContainerType[], string>>;
  getTissueTests: () => Promise<Result<TissueTest[], string>>;
  getTransferReasons: () => Promise<Result<Unit[], string>>;
  getUnits: (params: UnitRequest) => Promise<Result<Unit[], string>>;
  getUnitTypes: () => Promise<Result<UnitType[], string>>;
  getCompanyInfo: (isRegistryCompany: boolean) => Promise<Result<Company[], string>>;
  getContactInfo: () => Promise<Result<Contact[], string>>;
  getScrapieFlockInfo: (ownerId: string, isCompany: boolean) => Promise<Result<ScrapieFlockInfo | null, string>>;
  isOwnerCompany: (ownerId: string) => Promise<Result<boolean, string>>;
}

// -------------------- Registry --------------------
export interface RegistryAPI {
  parseBirths: () => Promise<Fulfillment<BirthRecord, BirthError>>;
  parseDeaths: () => Promise<Fulfillment<DeathRecord, DeathError>>;
  parseRegistrations: () => Promise<ParseResult<RegistrationParseResponse>>;
  parseTransfers: () => Promise<Fulfillment<TransferRecord, TransferError>>;
  process: (args: RegistryProcessRequest) => Promise<ProcessingResult>;
  processTransfers: (transferRecord: TransferRecord) => Promise<Result<ProcessSuccess, ProcessFailure>>;
  processDeaths: (deathRecord: DeathRecord) => Promise<Result<ProcessSuccess, ProcessFailure>>;
  processBirths: (birthRecord: BirthRecord, species: Species) => Promise<Result<ProcessSuccess, ProcessFailure>>;
}

// -------------------- Store --------------------
export interface StoreAPI {
  getSelectedDefault: () => Promise<DefaultSettingsResults | null>;
  getSelectedSpecies: () => Promise<Species | null>;
  getSelectedSignatureFilePath: () => Promise<string | null>;
  setSelectedDefault: (defaultSettings: DefaultSettingsResults) => Promise<void>;
  setSelectedSpecies: (species: Species | null) => Promise<void>;
  setSelectedSignatureFilePath: (filePath: string | null) => Promise<void>;
}

// -------------------- System --------------------
export interface SystemAPI {
  databaseStateCheck: () => Promise<DatabaseStateCheckResponse>;
  resolveDatabaseIssues: (dbscr: DatabaseStateCheckResponse) => Promise<Result<boolean, string>>;
  openDirectory: (path: string) => Promise<void>;
  openExternalURL: (url: string) => Promise<void>;
  openDatabase: () => Promise<string>;
  selectPngFile: () => Promise<string>;
}

// -------------------- Global IPC wrapper --------------------
export interface AnimalTrakkerIPC {
  animalAPI: AnimalAPI;
  exportAPI: ExportAPI;
  defaultsAPI: DefaultsAPI;
  lookupAPI: LookupAPI;
  registryAPI: RegistryAPI;
  storeAPI: StoreAPI;
  systemAPI: SystemAPI;
}
