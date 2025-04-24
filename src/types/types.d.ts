import { 
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
  DrugHistory, 
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
  WriteNewDefaultParameters
} from "../database";

import { Result } from "../shared/results/resultTypes";
import { AnimalInfo } from "../writers/helpers/animalInfo";

export {};

declare global {
  interface Window {
    electronAPI: {
      animalSearch: (params: AnimalSearchRequest) => Promise<AnimalSearchResult[]>;
      exportAnimalNotesCsv: (animals: AnimalInfo[]) => Promise<boolean>;
      exportDrugHistoryCsv: (animals: AnimalInfo[]) => Promise<boolean>;
      exportTissueTestResultsCsv: (animals: AnimalInfo[]) => Promise<boolean>;
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
      selectDatabase: () => Promise<string>;
      showAlert: (options: {
        title: string;
        message: string;
        type?: "info" | "error" | "warning" | "question";
      }) => Promise<void>;
      writeNewDefaultSettings: (params: WriteNewDefaultParameters) => Promise<boolean>;
    };
  }
}