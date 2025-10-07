
// export read models 
export type { BreedingAgesResult } from "./models/read/animal/breeding/breedingAges";
export type { OffspringInfo } from "./models/read/animal/births/offspringInfo";

// export read repositories
export { animalSearch } from "./repositories/read/animal/animalSearch/animalSearch";
export { animalHasActiveFederalTag } from "./repositories/read/animal/tags/hasFederalTag";
export { animalHasActiveOfficialTag } from "./repositories/read/animal/tags/hasOfficialTag";
export { getActiveScrapieFlockNumberId } from "./repositories/read/owners/getActiveScrapieFlockNumberId";
export { getAllCountryTagPrefixes } from "./repositories/read/tags/getAllCountryPrefixes";
export { getAnimalBirthDate } from "./repositories/read/animal/birthday/getAnimalBirthDate";
export { getAnimalIdentification } from "./repositories/read/animal/identification/getAnimalIdentification";
export { getAnimalNotes } from "./repositories/read/animal/notes/getAnimalNotes";
export { getAnimalRegistrationInfo } from "./repositories/read/registry/registrations/animalRegistrations";
export { getBirthTypeByDisplayOrder } from "./repositories/read/animal/births/birthTypes/getBirthTypeByDisplayOrder";
export { getBirthTypes } from "./repositories/read/animal/births/birthTypes/getBirthTypes";
export { getBreederById } from "./repositories/read/owners/getBreederFromId";
export { getBreederFromOwnershipHistory } from "./repositories/read/owners/fromDam/getBreederBasedOnBirthdate"
export { getBreeds } from "./repositories/read/animal/general/getBreeds";
export { getBreeder } from "./repositories/read/owners/getBreeder";
export { getBreedingAges } from "./repositories/read/animal/breeding/getBreedingAges";
export { getCoatColorForAnimal } from "./repositories/read/animal/coatColor/getCoatColor";
export { getColors } from "./repositories/read/tags/getColors";
export { getCompanies } from "./repositories/read/owners/getCompany";
export { getCompaniesForContact } from "./repositories/read/owners/getCompaniesForContact";
export { getContacts } from "./repositories/read/owners/getContact";
export { getCountries } from "./repositories/read/locations/getCountries";
export { getCountryPrefixForOwner } from "./repositories/read/tags/getCountryPrefixForOwner";
export { getCounties } from "./repositories/read/locations/getCounties";
export { getDeathReasons } from "./repositories/read/deaths/getDeathReaons";
export { getDefaultFlockBookId } from "./repositories/read/registry/registrations/getFlockBookIdFromRegCompany";
export { getDrugHistory } from "./repositories/read/animal/drugs/getDrugEvents";
export { getExistingDefaults } from "./repositories/read/defaults/getExistingDefaults";
export { getFlockPrefixByAnimalIdFromRegistration } from "./repositories/read/animal/flock/getFlockPrefixByAnimalIdFromRegistration";
export { getFlockPrefixIdByMembershipNumber } from "./repositories/read/owners/geFlockPrefixIdFromMemebershipNumber";
export { getFlockPrefixes } from "./repositories/read/animal/flock/getFlockPrefixes";
export { getLastBirthNotifyValue } from "./repositories/read/registry/registrations/getLastBirthNotifyValue";
export { getLastRegisteredValue } from "./repositories/read/registry/registrations/getLastRegisteredValue";
export { getOffspringOfDam } from "./repositories/read/animal/births/getOffspringOfDam";
export { getOwnerAtBirth } from "./repositories/read/owners/fromDam/getOwnerBasedOnBirthdate";
export { getOwner } from "./repositories/read/owners/getOwner";
export { getOwnerById } from "./repositories/read/owners/getOwnerById";
export { getPedigree } from "./repositories/read/animal/pedigree/getPedigree"
export { getPremises } from "./repositories/read/premises/getPremises";
export { getRegistrationTypeIdByRegNum } from "./repositories/read/registry/registrations/getRegistrationtypeIdByRegNum";
export { getRegistryCompanyIdForMembershipNumber } from "./repositories/read/registry/registrations/getRegistryCompanyIdFromMembershipNumber";
export { getRemoveReasons } from "./repositories/read/tags/getRemoveReasons";
export { getScrapieFlockInfo } from "./repositories/read/scrapie/getScrapieFlockInfo";
export { getSexById } from "./repositories/read/animal/sex/getSexById";
export { getSexes } from "./repositories/read/animal/sex/getSexes";
export { getSexFromAnimalId } from "./repositories/read/animal/sex/getSexFromAnimalId";
export { getSpecies } from "./repositories/read/animal/general/getSpecies";
export { getSpecificBirthType } from "./repositories/read/animal/births/birthTypes/getSpecificBirthType";
export { getStates } from "./repositories/read/locations/getStates"
export { getTagLocations } from "./repositories/read/tags/getLocations";
export { getTagTypes } from "./repositories/read/tags/getTagTypes";
export { getTissueSampleTypes } from "./repositories/read/tissues/getTissueSampleTypes";
export { getTissueSampleContainerTypes } from "./repositories/read/tissues/getTissueSampleContainerTypes";
export { getTissueTests } from "./repositories/read/tissues/getTissueTests";
export { getTissueTestResults } from "./repositories/read/animal/tests/getTissueTestResults";
export { getTransferReasons } from "./repositories/read/animal/transfers/getTransferReasons";
export { getUnits } from "./repositories/read/units/getUnits";
export { getUnitTypes } from "./repositories/read/units/getUnitTypes";
export { isOwnerCompany } from "./repositories/read/owners/isOwnerCompany"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export write models
export type { AnimalIdInfoInput } from "packages/api";
export type { InsertAnimalTableInput } from "./models/write/animal/animalTable/animalTableInput";
export type { InsertWeightRecordInput } from "./models/write/animal/weightEvaluation/animalEvaluationWeightInput";

// export write repositories
export { editExistingDefaultSettings } from "./repositories/write/defaults/editExistingDefault";
export { incrementLastBirthNotifyValue } from "./repositories/write/registrations/registrationNumbers/incrementLastBirthNotifyValue";
export { incrementLastDiedAtBirthValue } from "./repositories/write/registrations/registrationNumbers/incrementLastDiedAtBirthValue";
export { incrementLastRegistrationNumber } from "./repositories/write/registrations/registrationNumbers/incrementLastRegistrationNumber";
export { insertAnimalFlockTableRow } from "./repositories/write/animal/flock/insertAnimalFlockTableRow";
export { insertAnimalGoesToLocation } from "./repositories/write/animal/location/insertToRowAnimalLocationHistory";
export { insertAnimalIdInfoRow } from "./repositories/write/animal/id/insertAnimalIdRow";
export { insertAnimalNote } from "./repositories/write/animal/notes/insertAnimalNote";
export { insertAnimalRegistrationRow } from "./repositories/write/registrations/insertAnimalRegistrationRow";
export { insertBirthOwnershipRecord } from "./repositories/write/animal/ownership/insertBirthOwnershipRecord";
export { insertGeneticCoatRow } from "./repositories/write/animal/characteristics/insertGeneticCoatRow";
export { insertIntoAnimalTable } from "./repositories/write/animal/animalTable/insertIntoAnimalTable";
export { insertNewRegistryCertificateRow } from "./repositories/write/animal/registry/insertNewRegistryCertificateRow";
export { insertTransferOfOwnershipRecord } from "./repositories/write/animal/ownership/insertTransferOfOwnershipRecord";
export { insertWeightRecord } from "./repositories/write/animal/weightEvaluation/insertWeightEvaluation";
export { markAnimalDeathLocation } from "./repositories/write/animal/death/markAnimalDeathLocation";
export { markRegistryCertificateAsPrinted } from "./repositories/write/animal/registry/markRegistryCertificateAsPrinted";
export { markRegistryCertificateNotPrinted } from "./repositories/write/animal/registry/markRegistryCertificateNotPrinted";
export { updateAnimalDeath } from "./repositories/write/animal/death/updateAnimalDeath";
export { updateAnimalName } from "./repositories/write/animal/name/updateAnimalName";
export { writeNewDefaultSettings } from "./repositories/write/defaults/writeNewDefault"; 
export { writeAnimalBreedPercentages } from "./repositories/write/animal/breed/writeBreedPercentages";



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// registry DB calls

export { getAnimalDeathDate } from "./registry/read/getAnimalDeathDate";
export { getGestationPeriod } from "./registry/read/getGestationPeriod";

// db state checkers
export { verifyLastRegistrationNumberIsUpToDate } from "./registry/read/dbStateCheck/verifyLastRegistrationNumberUpToDate";

export type { AnimalDeathDate } from "./registry/read/getAnimalDeathDate";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// delete calls

export { deleteAnimalAlerts } from "./repositories/delete/animal/deleteAnimalAlerts";
export { deleteAnimalAtStudEntriesWithoutFrozenSemen } from "./repositories/delete/animal/deleteAnimalAtStudExceptFrozenSemen";
export { deleteAnimalForSaleEntry } from "./repositories/delete/animal/deleteAnimalForSaleEntry";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DB constant

export type { RegistryType } from "packages/api";

export { 
    DIED_STILLBORN,
    REGISTRATION_BIRTH_NOTIFY,
    REGISTRATION_DIED_AT_BIRTH,
    REGISTRATION_CHOCOLATE_WELSH,
    REGISTRATION_WHITE_WELSH,
    REGISTRATION_REGISTERED,
    ID_TRANSFER_REASON_TRANSFERRED_BREEDING,
} from "./dbConstants";

export { }

// DB mappings
export { registryTypeToUuid } from "./dbConstants";
