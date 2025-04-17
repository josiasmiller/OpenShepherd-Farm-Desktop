import { 
  AnimalSearchResult,
  BirthType,
  Breed, 
  Color, 
  Company,
  Country,
  County, 
  DeathReason,
  DefaultSettingsResults, 
  FlockPrefix, 
  Owner, 
  Premise, 
  RemoveReason,
  Sex, 
  Species,
  State,
  TagType, 
  TissueSampleContainerType,
  TissueSampleType, 
  TissueTest, 
  Unit, 
  UnitType
} from "./database";

export {};

declare global {
  interface Window {
    electronAPI: {
      selectDatabase: () => Promise<{ message: string }>;
      isDatabaseLoaded: () => Promise<boolean>;
      getOwnerInfo: () => Promise<Owner[]>;
      getCompanyInfo: () => Promise<Company[]>;
      getPremiseInfo: () => Promise<Premise[]>;
      animalSearch: () => Promise<AnimalSearchResult[]>;
      getBirthTypes: () => Promise<BirthType[]>;
      getBreeds: () => Promise<Breed[]>;
      getColors: () => Promise<Color[]>;
      getCountries: () => Promise<Country[]>;
      getCounties: () => Promise<County[]>;
      getDeathReasons: () => Promise<DeathReason[]>;
      getExistingDefaults: () => Promise<DefaultSettingsResults[]>;
      getFlockPrefixes: () => Promise<FlockPrefix[]>;
      getLocations: () => Promise<Location[]>;
      getRemoveReasons: () => Promise<RemoveReason[]>;
      getSexes: () => Promise<Sex[]>;
      getSpecies: () => Promise<Species[]>;
      getStates: () => Promise<State[]>;
      getTagTypes: () => Promise<TagType[]>;
      getTissueSampleTypes: () => Promise<TissueSampleType[]>;
      getTissueSampleContainerTypes: () => Promise<TissueSampleContainerType[]>;
      getTissueTests: () => Promise<TissueTest[]>;
      getTransferReasons: () => Promise<Unit[]>;
      getUnits: () => Promise<Unit[]>;
      getUnitTypes: () => Promise<UnitType[]>;
    };
  }
}