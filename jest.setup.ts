/// <reference path="src/types.d.ts" />
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

import { Failure, Success } from './src/shared/results/resultTypes';

import { mockBirthTypes } from './src/testData/mockBirthTypes';
import { mockBreeds } from './src/testData/mockBreeds';
import { mockColors } from './src/testData/mockColors';
import { mockCompanies } from './src/testData/mockCompanies';
import { mockCounties } from './src/testData/mockCounties';
import { mockCountries } from './src/testData/mockCountries';
import { mockDeathReasons } from './src/testData/mockDeathReasons';
import { mockExistingDefaults } from "./src/testData/mockExistingDefaults"
import { mockFlockPrefixes } from './src/testData/mockFlockPrefixes';
import { mockLocations } from './src/testData/mockLocations';
import { mockOwners } from './src/testData/mockOwners';
import { mockPremises } from './src/testData/mockPremises';
import { mockRemoveReasons } from './src/testData/mockRemoveReasons';
import { mockSexes } from './src/testData/mockSexes';
import { mockSpecies } from './src/testData/mockSpecies';
import { mockStates } from './src/testData/mockStates';
import { mockTagTypes } from './src/testData/mockTagTypes';
import { mockTissueSampleContainerTypes } from './src/testData/mockTissueSampleContainerTypes';
import { mockTissueSampleTypes } from './src/testData/mockTissueSampleTypes';
import { mockTissueTests } from './src/testData/mockTissueTests';
import { mockTransferReasons } from './src/testData/mockTransferReasons';
import { mockCurrencyUnits, mockWeightUnits } from './src/testData/mockUnits';
import { mockUnitTypes } from './src/testData/mockUnitTypes';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;



beforeAll(() => {
  window.electronAPI = {
    selectDatabase: jest.fn().mockResolvedValue("fake/path/to/db.sqlite"),
    isDatabaseLoaded: jest.fn().mockResolvedValue(true),
    getExistingDefaults: jest.fn().mockResolvedValue(mockExistingDefaults),
    getCompanyInfo: jest.fn().mockResolvedValue(mockCompanies),
    getPremiseInfo: jest.fn().mockResolvedValue(mockPremises),
    animalSearch: jest.fn().mockResolvedValue([]),
    getBirthTypes: jest.fn().mockResolvedValue(mockBirthTypes),
    getBreeds: jest.fn().mockResolvedValue(mockBreeds),
    getColors: jest.fn().mockResolvedValue(mockColors),
    getCountries: jest.fn().mockResolvedValue(mockCountries),
    getCounties: jest.fn().mockResolvedValue(mockCounties),
    getDeathReasons: jest.fn().mockResolvedValue(mockDeathReasons),
    getFlockPrefixes: jest.fn().mockResolvedValue(mockFlockPrefixes),
    getLocations: jest.fn().mockResolvedValue(mockLocations),
    getOwnerInfo: jest.fn().mockResolvedValue(mockOwners),
    getRemoveReasons: jest.fn().mockResolvedValue(mockRemoveReasons),
    getSexes: jest.fn().mockResolvedValue(mockSexes),
    getSpecies: jest.fn().mockResolvedValue(mockSpecies),
    getStates: jest.fn().mockResolvedValue(mockStates),
    getTagTypes: jest.fn().mockResolvedValue(mockTagTypes),
    getTissueSampleTypes: jest.fn().mockResolvedValue(mockTissueSampleTypes),
    getTissueSampleContainerTypes: jest.fn().mockResolvedValue(mockTissueSampleContainerTypes),
    getTissueTests: jest.fn().mockResolvedValue(mockTissueTests),
    getTransferReasons: jest.fn().mockResolvedValue(mockTransferReasons),
    getUnits: jest.fn().mockImplementation((req) => {
      if (req.unit_type_name === "Weight") {
        return Promise.resolve(new Success(mockWeightUnits));
      } else if (req.unit_type_name === "Currency") {
        return Promise.resolve(new Success(mockCurrencyUnits));
      } else {
        return Promise.resolve(new Failure("Unsupported unit request"));
      }
    }),
    getUnitTypes: jest.fn().mockResolvedValue(mockUnitTypes),
  };
});