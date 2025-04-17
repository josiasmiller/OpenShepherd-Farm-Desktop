/// <reference path="src/types.d.ts" />
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

import { mockBirthTypes } from './src/testData/mockBirthTypes';
import { mockBreeds } from './src/testData/mockBreeds';
import { mockCompanies } from './src/testData/mockCompanies';
import { mockPremises } from './src/testData/mockPremises';
import { mockOwners } from './src/testData/mockOwners';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;



beforeAll(() => {
  window.electronAPI = {
    selectDatabase: jest.fn().mockResolvedValue("fake/path/to/db.sqlite"),
    isDatabaseLoaded: jest.fn().mockResolvedValue(true),
    getExistingDefaults: jest.fn().mockResolvedValue([]),
    getOwnerInfo: jest.fn().mockResolvedValue(mockOwners),
    getCompanyInfo: jest.fn().mockResolvedValue(mockCompanies),
    getPremiseInfo: jest.fn().mockResolvedValue(mockPremises),
    animalSearch: jest.fn().mockResolvedValue([]),
    getBirthTypes: jest.fn().mockResolvedValue(mockBirthTypes),
    getBreeds: jest.fn().mockResolvedValue(mockBreeds),
    getColors: jest.fn().mockResolvedValue([]),
    getCompanies: jest.fn().mockResolvedValue([]),
    getCountries: jest.fn().mockResolvedValue([]),
    getCounties: jest.fn().mockResolvedValue([]),
    getDeathReasons: jest.fn().mockResolvedValue([]),
    getFlockPrefixes: jest.fn().mockResolvedValue([]),
    getLocations: jest.fn().mockResolvedValue([]),
    getOwners: jest.fn().mockResolvedValue([]),
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