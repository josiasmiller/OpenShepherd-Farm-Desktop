/// <reference path="src/types.d.ts" />
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

import { mockBirthTypes } from './src/testData/mockBirthTypes';
import { mockBreeds } from './src/testData/mockBreeds';
import { mockColors } from './src/testData/mockColors';
import { mockCompanies } from './src/testData/mockCompanies';
import { mockCounties } from './src/testData/mockCounties';
import { mockCountries } from './src/testData/mockCountries';
import { mockDeathReasons } from './src/testData/mockDeathReasons';
import { mockFlockPrefixes } from './src/testData/mockFlockPrefixes';
import { mockLocations } from './src/testData/mockLocations';
import { mockOwners } from './src/testData/mockOwners';
import { mockPremises } from './src/testData/mockPremises';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;



beforeAll(() => {
  window.electronAPI = {
    selectDatabase: jest.fn().mockResolvedValue("fake/path/to/db.sqlite"),
    isDatabaseLoaded: jest.fn().mockResolvedValue(true),
    getExistingDefaults: jest.fn().mockResolvedValue([]),
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
    getPremises: jest.fn().mockResolvedValue([]),
    getRemoveReasons: jest.fn().mockResolvedValue([]),
    getSexes: jest.fn().mockResolvedValue([]),
    getSpecies: jest.fn().mockResolvedValue([]),
    getStates: jest.fn().mockResolvedValue([]),
    getTagTypes: jest.fn().mockResolvedValue([]),
    getTissueSampleTypes: jest.fn().mockResolvedValue([]),
    getTissueSampleContainerTypes: jest.fn().mockResolvedValue([]),
    getTissueTests: jest.fn().mockResolvedValue([]),
    getTransferReasons: jest.fn().mockResolvedValue([]),
    getUnits: jest.fn().mockResolvedValue([]),
    getUnitTypes: jest.fn().mockResolvedValue([]),
  };
});