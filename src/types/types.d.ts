import { 
  AnimalIdentification,
  AnimalSearchRequest,
  AnimalSearchResult,
  BirthType,
  Breed, 
  BreedRequest, 
  Color, 
  Company,
  Country,
  County, 
  DeathReason,
  DefaultSettingsResults, 
  DrugEvent, 
  FlockPrefix, 
  Owner, 
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
  NewDefaultSettingsParameters
} from "../database";

import { Result } from "../shared/results/resultTypes";

export {};

declare global {
  interface Window {
    electronAPI: {
      animalSearch: (params: AnimalSearchRequest) => Promise<AnimalSearchResult[]>;
      getAnimalIdentification: (animalId: string) => Promise<Result<AnimalIdentification[], string>>;
      editExistingDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>;
      exportAnimalNotesCsv: (animalIds: string[]) => Promise<boolean>;
      exportDrugHistoryCsv: (animalIds: string[]) => Promise<boolean>;
      exportTissueTestResultsCsv: (animalIds: string[]) => Promise<boolean>;
      exportPdfTest: (animalIds: string[]) => Promise<boolean>;
      getOwnerInfo: () => Promise<Result<Owner[], string>>;
      getCompanyInfo: (isRegistryCompany: boolean) => Promise<Result<Company[], string>>;
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
      isDatabaseLoaded: () => Promise<boolean>;
      openExternalURL: (url: string) => Promise<void>;
      selectDatabase: () => Promise<string>;
      writeNewDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>;
    };
  }
}