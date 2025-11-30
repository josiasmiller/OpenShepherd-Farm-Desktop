import {ipcMain, IpcMainInvokeEvent, shell} from "electron";

import {
  animalSearch,
  editExistingDefaultSettings,
  getAnimalDetails,
  getAnimalIdentification,
  getBirthTypes,
  getBreeds,
  getColors,
  getCompanies,
  getContacts,
  getCounties,
  getCountries,
  getCountryPrefixForOwner,
  getDeathReasons,
  getExistingDefaults,
  getFlockPrefixes,
  getOwnerById,
  getPedigree,
  getPremises,
  getRemoveReasons,
  getScrapieFlockInfo,
  getSexes,
  getSpecies,
  getStates,
  getTagLocations,
  getTagTypes,
  getTissueSampleContainerTypes,
  getTissueSampleTypes,
  getTissueTests,
  getTransferReasons,
  getUnits,
  getUnitTypes,
  isOwnerCompany,
  writeNewDefaultSettings,
} from "./database";

import {pngFileDialog} from "./selectPng";
import {writeAnimalNotesCsv} from "./writers/csv/writeAnimalNotes";
import {writeDrugHistoryCsv} from "./writers/csv/writeDrugEvents";
import {writeTissueTestResults} from "./writers/csv/writeTissueTestResults";

import {writeRegistration} from "./writers/pdf/writeRegistration";

import {birthParser} from "./registry/processing/impl/births/parser/birthParser";
import {deathParser} from "./registry/processing/impl/deaths/parser/deathParser";
import {registrationParser} from "./registry/processing/impl/registrations/parser/registrationParser";
import {selectAndParseTransfers} from "./registry/processing/impl/transfers/parser/transferParser";
import {handleDatabaseStateCheck} from "./registry/processing/ipc/handleDatabaseStateCheck";
import {
  DatabaseStateCheckResponse,
  DefaultSettingsResults,
  OwnerType,
  RegistryProcessRequest,
  Species,
  TransferRecord,
} from '@app/api';

import {handleRegistryProcess} from "./registry/processing/ipc/handleRegistryProcess";
import {resolveDatabaseIssues} from "./registry/processing/ipc/resolveDatabaseStateIssues";
import {getStoreSelectedDefault, setStoreSelectedDefault} from "./store/impl/selectedDefault";
import {getStoreSelectedSpecies, setStoreSelectedSpecies} from "./store/impl/selectedSpecies";
import {getStoreSelectedFilepath, setStoreSelectedFilepath} from "./store/impl/selectedSignatureFilepath";
import {promiseFrom} from "@common/core";
import {atrkkrSessionForEvent} from "./session/sessionManagement";
import log from "electron-log";
import {validateAndProcessTransfers} from "./registry";
import {ApplicationSettings} from "@ipc/api";
import {AboutApp, AppAboutInfo} from "@app/buildVariant";

const IPC_INVOKE_ANIMAL_SEARCH = 'animal-search'
const IPC_INVOKE_EDIT_EXISTING_DEFAULT = 'edit-existing-default'
const IPC_INVOKE_EXPORT_ANIMAL_NOTES = 'export-animal-notes-csv'
const IPC_INVOKE_EXPORT_DRUG_HISTORY_CSV = 'export-drug-history-csv'
const IPC_INVOKE_EXPORT_TISSUE_TEST_RESULTS_CSV = 'export-tissue-test-results-csv'
const IPC_INVOKE_EXPORT_REGISTRATION = 'export-registration'
const IPC_INVOKE_SELECT_PNG_FILE = 'select-png-file'
const IPC_INVOKE_GET_ANIMAL_DETAILS = 'get-animal-details'; 
const IPC_INVOKE_GET_ANIMAL_IDENTIFICATION = 'get-animal-identification'
const IPC_INVOKE_GET_BIRTH_TYPES = 'get-birth-types'
const IPC_INVOKE_GET_BREEDS = 'get-breeds'
const IPC_INVOKE_GET_COLORS = 'get-colors'
const IPC_INVOKE_GET_COMPANY_INFO = 'get-company-info'
const IPC_INVOKE_GET_CONTACT_INFO = 'get-contact-info'
const IPC_INVOKE_GET_COUNTIES = 'get-counties'
const IPC_INVOKE_GET_COUNTRIES = 'get-countries'
const IPC_INVOKE_GET_COUNTRY_PREFIX_FOR_OWNER = 'get-country-prefix-for-owner'
const IPC_INVOKE_GET_DEATH_REASONS = 'get-death-reasons'
const IPC_INVOKE_GET_EXISTING_DEFAULTS = 'get-existing-defaults'
const IPC_INVOKE_GET_FLOCK_PREFIXES = 'get-flock-prefixes'
const IPC_INVOKE_GET_LOCATIONS = 'get-locations'
const IPC_INVOKE_GET_OWNER_BY_ID = 'get-owner-by-id'
const IPC_INVOKE_GET_PEDIGREE = 'get-pedigree'
const IPC_INVOKE_GET_PREMISE_INFO = 'get-premise-info'
const IPC_INVOKE_GET_REMOVE_REASONS = 'get-remove-reasons'
const IPC_INVOKE_GET_SCRAPIE_FLOCK_INFO = 'get-scrapie-flock-info'
const IPC_INVOKE_GET_STORE_SELECTED_DEFAULT = 'get-store-selected-default'
const IPC_INVOKE_GET_STORE_SELECTED_SPECIES = 'get-store-selected-species'
const IPC_INVOKE_GET_STORE_SELECTED_SIGNATURE_FILE_PATH = 'get-store-selected-signature-file-path'
const IPC_INVOKE_GET_SEXES = 'get-sexes'
const IPC_INVOKE_GET_SPECIES = 'get-species'
const IPC_INVOKE_GET_STATES = 'get-states'
const IPC_INVOKE_GET_TAG_TYPES = 'get-tag-types'
const IPC_INVOKE_GET_TISSUE_SAMPLE_TYPES = 'get-tissue-sample-types'
const IPC_INVOKE_GET_TISSUE_SAMPLE_CONTAINER_TYPES = 'get-tissue-sample-container-types'
const IPC_INVOKE_GET_TISSUE_TESTS = 'get-tissue-tests'
const IPC_INVOKE_GET_TRANSFER_REASONS = 'get-transfer-reasons'
const IPC_INVOKE_GET_UNITS = 'get-units'
const IPC_INVOKE_GET_UNIT_TYPES = 'get-unit-types'
const IPC_INVOKE_IS_OWNER_COMPANY = 'is-owner-company'
const IPC_INVOKE_REGISTRY_PARSE_BIRTHS = 'registry-parse-births'
const IPC_INVOKE_REGISTRY_PARSE_DEATHS = 'registry-parse-deaths'
const IPC_INVOKE_REGISTRY_PARSE_REGISTRATIONS = 'registry-parse-registrations'
const IPC_INVOKE_REGISTRY_PARSE_TRANSFERS = 'registry-parse-transfers'
const IPC_INVOKE_REGISTRY_PROCESS = 'registry-process'
const IPC_INVOKE_REGISTRY_PROCESS_TRANSFERS = 'registry-process-transfers'
const IPC_INVOKE_DATABASE_STATE_CHECK = 'database-state-check'
const IPC_INVOKE_RESOLVE_DATABASE_ISSUES = 'resolve-database-issues'
const IPC_INVOKE_SET_STORE_SELECTED_DEFAULT = 'set-store-selected-default'
const IPC_INVOKE_SET_STORE_SELECTED_SPECIES = 'set-store-selected-species'
const IPC_INVOKE_SET_STORE_SELECTED_SIGNATURE_FILE_PATH = 'set-store-selected-signature-file-path'
const IPC_INVOKE_WRITE_NEW_DEFAULT_SETTINGS = 'write-new-default-settings'

const logAndThrowUnhandledIpcRequest = (channel: string, event: IpcMainInvokeEvent) => {
  const message = `Unhandled IPC invocation in main process : No session found : sender=${event.sender.id}, channel=${channel}`
  log.error(message); throw Error(message);
}

export const registerIpcHandlers = () => {

  ipcMain.handle(IPC_INVOKE_ANIMAL_SEARCH, async (event: IpcMainInvokeEvent, queryParams) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return animalSearch(session.db.raw(), queryParams);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_ANIMAL_SEARCH, event)
  });

  ipcMain.handle(IPC_INVOKE_EDIT_EXISTING_DEFAULT, async (event: IpcMainInvokeEvent, queryParams) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return editExistingDefaultSettings(session.db.raw(), queryParams)
        .then(() => {
          session.window.webContents.send('default-settings-list-changed')
        });
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_EDIT_EXISTING_DEFAULT, event)
  });

  ipcMain.handle(IPC_INVOKE_EXPORT_ANIMAL_NOTES, async (event: IpcMainInvokeEvent, animals: string[]) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return writeAnimalNotesCsv(session.db.raw(), animals);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_EXPORT_ANIMAL_NOTES, event)
  });

  ipcMain.handle(IPC_INVOKE_EXPORT_DRUG_HISTORY_CSV, async (event: IpcMainInvokeEvent, animals: string[]) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return writeDrugHistoryCsv(session.db.raw(), animals);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_EXPORT_DRUG_HISTORY_CSV, event)
  });

  ipcMain.handle(IPC_INVOKE_EXPORT_TISSUE_TEST_RESULTS_CSV, async (event: IpcMainInvokeEvent, animals: string[]) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return writeTissueTestResults(session.db.raw(), animals);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_EXPORT_TISSUE_TEST_RESULTS_CSV, event)
  });

  ipcMain.handle(IPC_INVOKE_EXPORT_REGISTRATION, async (event: IpcMainInvokeEvent, animals: string[], registrationType: "black" | "white" | "chocolate", signatureFilePath: string | null) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return writeRegistration(session.db.raw(), animals, registrationType, signatureFilePath);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_EXPORT_REGISTRATION, event)
  });

  ipcMain.handle(IPC_INVOKE_SELECT_PNG_FILE, async (event: IpcMainInvokeEvent, ) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return pngFileDialog(session.window);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_SELECT_PNG_FILE, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_ANIMAL_IDENTIFICATION, async (event: IpcMainInvokeEvent, animalId: string) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getAnimalIdentification(session.db.raw(), animalId);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_ANIMAL_IDENTIFICATION, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_BIRTH_TYPES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getBirthTypes(session.db.raw())
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_BIRTH_TYPES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_ANIMAL_DETAILS, async (event: IpcMainInvokeEvent, animalIds: string[]) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getAnimalDetails(session.db, animalIds);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_ANIMAL_DETAILS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_BREEDS, async (event: IpcMainInvokeEvent, queryParams) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getBreeds(session.db.raw(), queryParams);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_BREEDS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_COLORS, (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getColors(session.db.raw())
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_COLORS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_COMPANY_INFO, async (event: IpcMainInvokeEvent, onlyGetRegistryCompanies) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getCompanies(session.db.raw(), onlyGetRegistryCompanies);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_COMPANY_INFO, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_CONTACT_INFO, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getContacts(session.db.raw())
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_CONTACT_INFO, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_COUNTIES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getCounties(session.db.raw())
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_COUNTIES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_COUNTRIES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getCountries(session.db.raw())
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_COUNTRIES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_COUNTRY_PREFIX_FOR_OWNER, async (event: IpcMainInvokeEvent, ownerId: string, isCompany: boolean) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getCountryPrefixForOwner(session.db.raw(), ownerId, isCompany);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_COUNTRY_PREFIX_FOR_OWNER, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_DEATH_REASONS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getDeathReasons(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_DEATH_REASONS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_EXISTING_DEFAULTS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getExistingDefaults(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_EXISTING_DEFAULTS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_FLOCK_PREFIXES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getFlockPrefixes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_FLOCK_PREFIXES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_LOCATIONS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTagLocations(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_LOCATIONS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_PEDIGREE, async (event: IpcMainInvokeEvent, animalId) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getPedigree(session.db.raw(), animalId, 4);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_PEDIGREE, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_OWNER_BY_ID, async (event: IpcMainInvokeEvent, ownerId: string, ownerType: OwnerType) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getOwnerById(session.db.raw(), ownerId, ownerType);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_OWNER_BY_ID, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_PREMISE_INFO, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getPremises(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_PREMISE_INFO, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_REMOVE_REASONS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getRemoveReasons(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_REMOVE_REASONS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_SCRAPIE_FLOCK_INFO, async (event: IpcMainInvokeEvent, ownerId: string, isCompany: boolean) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getScrapieFlockInfo(session.db.raw(), ownerId, isCompany);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_SCRAPIE_FLOCK_INFO, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_STORE_SELECTED_DEFAULT, (event: IpcMainInvokeEvent): DefaultSettingsResults | null => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      return getStoreSelectedDefault();
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_STORE_SELECTED_DEFAULT, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_STORE_SELECTED_SPECIES, (event: IpcMainInvokeEvent): Species | null => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      return getStoreSelectedSpecies();
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_STORE_SELECTED_SPECIES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_STORE_SELECTED_SIGNATURE_FILE_PATH, (event: IpcMainInvokeEvent): string => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      return getStoreSelectedFilepath();
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_STORE_SELECTED_SIGNATURE_FILE_PATH, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_SEXES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getSexes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_SEXES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_SPECIES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getSpecies(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_SPECIES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_STATES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getStates(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_STATES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_TAG_TYPES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTagTypes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_TAG_TYPES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_TISSUE_SAMPLE_TYPES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTissueSampleTypes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_TISSUE_SAMPLE_TYPES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_TISSUE_SAMPLE_CONTAINER_TYPES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTissueSampleContainerTypes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_TISSUE_SAMPLE_CONTAINER_TYPES, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_TISSUE_TESTS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTissueTests(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_TISSUE_TESTS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_TRANSFER_REASONS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getTransferReasons(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_TRANSFER_REASONS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_UNITS, async (event: IpcMainInvokeEvent, queryParams) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getUnits(session.db.raw(), queryParams);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_UNITS, event)
  });

  ipcMain.handle(IPC_INVOKE_GET_UNIT_TYPES, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return getUnitTypes(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_GET_UNIT_TYPES, event)
  });

  ipcMain.handle(IPC_INVOKE_IS_OWNER_COMPANY, async (event: IpcMainInvokeEvent, ownerId) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return isOwnerCompany(session.db.raw(), ownerId);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_IS_OWNER_COMPANY, event)
  });

  ipcMain.handle('open-directory', async (event: IpcMainInvokeEvent, path) => {
    return shell.openPath(path);
  });

  ipcMain.handle("open-external-url", async (_, url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL'); // security check, we only want valid URLs sent
    }
    await shell.openExternal(url);
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PARSE_BIRTHS, async (event: IpcMainInvokeEvent, ) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return birthParser(session.window);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PARSE_BIRTHS, event)
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PARSE_DEATHS, async (event: IpcMainInvokeEvent, ) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return deathParser(session.window);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PARSE_DEATHS, event)
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PARSE_REGISTRATIONS, async (event: IpcMainInvokeEvent, ) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return registrationParser(session.window);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PARSE_REGISTRATIONS, event)
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PARSE_TRANSFERS, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return selectAndParseTransfers(session.window);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PARSE_TRANSFERS, event)
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PROCESS, async (event: IpcMainInvokeEvent, args: RegistryProcessRequest) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      const {processType, species, sections} = args;
      return handleRegistryProcess(session.db.raw(), processType, species, sections);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PROCESS, event)
  });

  ipcMain.handle(IPC_INVOKE_REGISTRY_PROCESS_TRANSFERS, async (event: IpcMainInvokeEvent, transferRecord: TransferRecord) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return validateAndProcessTransfers(session.db.raw(), transferRecord); // TODO --> fix DB type
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_REGISTRY_PROCESS_TRANSFERS, event)
  });

  

  ipcMain.handle(IPC_INVOKE_DATABASE_STATE_CHECK, async (event: IpcMainInvokeEvent) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return handleDatabaseStateCheck(session.db.raw());
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_DATABASE_STATE_CHECK, event)
  });

  ipcMain.handle(IPC_INVOKE_RESOLVE_DATABASE_ISSUES, (event: IpcMainInvokeEvent, dbscr: DatabaseStateCheckResponse) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return resolveDatabaseIssues(session.db.raw(), dbscr);
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_RESOLVE_DATABASE_ISSUES, event)
  });

  ipcMain.handle(IPC_INVOKE_SET_STORE_SELECTED_DEFAULT, async (event: IpcMainInvokeEvent, value: DefaultSettingsResults) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      setStoreSelectedDefault(value)
      session.window.webContents.send('active-default-settings-changed')
      return
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_SET_STORE_SELECTED_DEFAULT, event)
  });

  ipcMain.handle(IPC_INVOKE_SET_STORE_SELECTED_SPECIES, (event: IpcMainInvokeEvent, value: Species) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      return promiseFrom(() => setStoreSelectedSpecies(value));
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_SET_STORE_SELECTED_SPECIES, event)
  });

  ipcMain.handle(IPC_INVOKE_SET_STORE_SELECTED_SIGNATURE_FILE_PATH, (event: IpcMainInvokeEvent, value: string) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      //TODO: Update storage of to consider database path/identifier
      return promiseFrom(() => setStoreSelectedFilepath(value));
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_SET_STORE_SELECTED_SIGNATURE_FILE_PATH, event)
  });

  ipcMain.handle(IPC_INVOKE_WRITE_NEW_DEFAULT_SETTINGS, async (event: IpcMainInvokeEvent, queryParams) => {
    const session = atrkkrSessionForEvent(event)
    if (session) {
      return writeNewDefaultSettings(session.db.raw(), queryParams)
        .then(() => {
          session.window.webContents.send('default-settings-list-changed')
        });
    }
    logAndThrowUnhandledIpcRequest(IPC_INVOKE_WRITE_NEW_DEFAULT_SETTINGS, event)
  });

  ipcMain.handle(ApplicationSettings.CHANNEL_QUERY_ABOUT_APP, async (_: IpcMainInvokeEvent): Promise<AppAboutInfo> => {
    return promiseFrom(() => {
      return AboutApp
    })
  })

  ipcMain.handle(ApplicationSettings.CHANNEL_OPEN_ATRKKR_WEBSITE, async (_: IpcMainInvokeEvent): Promise<void> => {
    return shell.openExternal('https://animaltrakker.com')
  })

  ipcMain.handle(ApplicationSettings.CHANNEL_OPEN_ATRKKR_SUPPORT_MAIL, async (_: IpcMainInvokeEvent): Promise<void> => {
    return shell.openExternal('mailto:support@animaltrakker.com')
  })

  ipcMain.handle(ApplicationSettings.CHANNEL_OPEN_ATRKKR_BUILD_COMMIT, async (_: IpcMainInvokeEvent): Promise<void> => {
    return shell.openExternal(`https://gitlab.com/animaltrakker_system/animaltrakker_desktop/-/commit/${AboutApp.commitSHAFull}`)
  })
};
