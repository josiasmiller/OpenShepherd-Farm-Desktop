import { 
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
  ScrapieFlockInfo
} from "../database";

import { Result } from "../shared/results/resultTypes";
import { ParseResult, ProcessingResult, RegistryProcessRequest } from "../registry/processing/core/types";

import { BirthParseResponse } from "../registry/processing/impl/births/parser/util/birthParseRow";
import { RegistrationWriteResponse } from "../writers/pdf/writeRegistration";
import { RegistrationParseResponse } from "../registry/processing/impl/registrations/parser/util/registrationParseRow";
import { TransferParseResponse } from "src/registry/processing/impl/transfers/parser/util/transferParseData";
import { DeathParseResponse } from "../registry/processing/impl/deaths/parser/util/deathParseRow";


declare global {
  interface Window {
    electronAPI: {
      animalSearch: (params: AnimalSearchRequest) => Promise<AnimalSearchResult[]>;
      databaseStateCheck: () => Promise<DatabaseStateCheckResponse>;
      resolveDatabaseIssues: (dbscr: DatabaseStateCheckResponse) => Promise<Result<boolean, string>>;
      getAnimalIdentification: (animalId: string) => Promise<Result<AnimalIdentification[], string>>;
      editExistingDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>;
      exportAnimalNotesCsv: (animalIds: string[]) => Promise<boolean>;
      exportDrugHistoryCsv: (animalIds: string[]) => Promise<boolean>;
      exportTissueTestResultsCsv: (animalIds: string[]) => Promise<boolean>;
      exportRegistration: (animalIds: string[], registrationType: "black" | "white" | "chocolate") => Promise<RegistrationWriteResponse>;
      getCompanyInfo: (isRegistryCompany: boolean) => Promise<Result<Company[], string>>;
      getContactInfo: () => Promise<Result<Contact[], string>>;
      getPedigree: (animalId: string) => Promise<Result<PedigreeNode, string>>;
      getPremiseInfo: () => Promise<Result<Premise[], string>>;
      getBirthTypes: () => Promise<Result<BirthType[], string>>;
      getBreeds: (params: BreedRequest) => Promise<Result<Breed[], string>>;
      getColors: () => Promise<Result<Color[], string>>;
      getCountries: () => Promise<Result<Country[], string>>;
      getCounties: () => Promise<Result<County[], string>>;
      getDeathReasons: () => Promise<Result<DeathReason[], string>>;
      getExistingDefaults: () => Promise<Result<DefaultSettingsResults[], string>>;
      getFlockPrefixes: () => Promise<Result<FlockPrefix[], string>>;
      getLocations: () => Promise<Result<TagLocation[], string>>;
      getRemoveReasons: () => Promise<Result<RemoveReason[], string>>;
      getScrapieFlockInfo: (ownerId: string, isCompany: boolean) => Promise<Result<ScrapieFlockInfo | null, string>>;
      getStoreSelectedDefault: () => Promise<DefaultSettingsResults | null>;
      getStoreSelectedSpecies: () => Promise<Species | null>;
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
      isOwnerCompany: (ownerId: string) => Promise<Result<boolean, string>>;
      isDatabaseLoaded: () => Promise<boolean>;
      openDirectory: (path: string) => Promise<void>;
      openExternalURL: (url: string) => Promise<void>;
      registryParseBirths: () => Promise<ParseResult<BirthParseResponse>>;
      registryParseDeaths: () => Promise<ParseResult<DeathParseResponse>>;
      registryParseRegistrations: () => Promise<ParseResult<RegistrationParseResponse>>;
      registryParseTransfers: () => Promise<ParseResult<TransferParseResponse>>;
      registryProcess: (args: RegistryProcessRequest) => Promise<ProcessingResult>;
      setStoreSelectedDefault: (defaultSettings: DefaultSettingsResults) => Promise<void>;
      setStoreSelectedSpecies: (species: Species) => Promise<void>;
      selectDatabase: () => Promise<string>;
      writeNewDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>;
    };
  }
}