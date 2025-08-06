
// export read models 
export type { AnimalIdentification } from "./models/read/animal/identification/animalIdentification";
export type { AnimalNote } from "./models/read/animal/notes/animalNote";
export type { AnimalSearchResult, AnimalSearchRequest } from "./models/read/animal/animalSeach/animalSearch";
export type { AnimalRegistrationResult } from "./models/read/registry/registrations/animalRegistration";
export type { BirthType } from "./models/read/animal/births/birthType";
export type { BreedRequest, Breed } from "./models/read/animal/general/breed";
export type { BreedingAgesResult } from "./models/read/animal/breeding/breedingAges";
export type { CoatColor } from "./models/read/animal/coatColor/coatColor";
export type { Company } from "./models/read/owners/company";
export type { Contact } from "./models/read/owners/contact";
export type { Color } from "./models/read/tags/color";
export type { Country } from "./models/read/locations/country";
export type { County } from "./models/read/locations/county";
export type { DeathReason } from "./models/read/deaths/deathReason";
export type { DrugEvent } from "./models/read/animal/drugs/drugEvent";
export type { DefaultSettingsResults } from "./models/read/defaults/getExistingDefaults";
export type { FlockPrefix } from "./models/read/animal/flocks/flockPrefix"
export type { OffspringInfo } from "./models/read/animal/births/offspringInfo";
export type { Owner } from "./models/read/owners/owner"
export type { PedigreeNode } from "./models/read/animal/pedigree/pedigree"
export type { Premise } from "./models/read/premises/premise";
export type { RemoveReason } from "./models/read/tags/removeReason";
export type { Sex } from "./models/read/animal/general/sex";
export type { Species } from "./models/read/animal/general/species";
export type { State } from "./models/read/locations/state";
export type { TagLocation } from "./models/read/tags/location";
export type { TagType } from "./models/read/tags/tagType";
export type { TissueSampleType } from "./models/read/tissues/tissueSampleType"
export type { TissueSampleContainerType } from "./models/read/tissues/tissueSampleContainerType"
export type { TissueTest } from "./models/read/tissues/tissueTest"
export type { TissueTestResult } from "./models/read/animal/tests/tissueTestResult";
export type { TransferReason } from "./models/read/animal/transfers/transferReaon"
export type { UnitRequest, Unit } from "./models/read/units/unit";
export type { UnitType } from "./models/read/units/unitType";

// export read repositories
export { animalSearch } from "./repositories/read/animal/animalSearch/animalSearch";
export { animalHasActiveFederalTag } from "./repositories/read/animal/tags/hasFederalTag";
export { animalHasActiveOfficialTag } from "./repositories/read/animal/tags/hasOfficialTag";
export { getActiveScrapieFlockNumberId } from "./repositories/read/owners/getActiveScrapieFlockNumberId";
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
export { getContacts } from "./repositories/read/owners/getContact";
export { getCountries } from "./repositories/read/locations/getCountries";
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
export { getPedigree } from "./repositories/read/animal/pedigree/getPedigree"
export { getPremises } from "./repositories/read/premises/getPremises";
export { getRegistryCompanyIdForMembershipNumber } from "./repositories/read/registry/registrations/getRegistryCompanyIdFromMembershipNumber";
export { getRemoveReasons } from "./repositories/read/tags/getRemoveReasons";
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export write models
export type { NewDefaultSettingsParameters } from "./models/write/defaults/newDefaultSettings";
export type { AnimalIdInfoInput } from "./models/write/animal/id/animalIdInfoInput";
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

export { getAnimalDeathDate } from "./registry/getAnimalDeathDate";
export { getGestationPeriod } from "./registry/getGestationPeriod";

export type { AnimalDeathDate } from "./registry/getAnimalDeathDate";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// delete calls

export { deleteAnimalAlerts } from "./repositories/delete/animal/deleteAnimalAlerts";
export { deleteAnimalAtStudEntriesWithoutFrozenSemen } from "./repositories/delete/animal/deleteAnimalAtStudExceptFrozenSemen";
export { deleteAnimalForSaleEntry } from "./repositories/delete/animal/deleteAnimalForSaleEntry";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DB constant

export type { RegistryType } from "./dbConstants";

export { DIED_STILLBORN } from "./dbConstants";
export { REGISTRATION_BIRTH_NOTIFY } from "./dbConstants";
export { REGISTRATION_DIED_AT_BIRTH } from "./dbConstants";

// DB mappings
export { registryTypeToUuid } from "./dbConstants";
