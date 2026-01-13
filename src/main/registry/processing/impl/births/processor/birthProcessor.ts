import {Database} from "@database/async";
import {handleResult, Result, unwrapOrThrow, isUUIDv4, Success, Failure} from '@common/core';
import {
  RegistryRow,
  Sex,
  Species,
  ProcessingResult,
  ValidationResult,
  BirthRecord,
  BirthNotification, ProcessSuccess, ProcessFailure,
} from '@app/api';

import { getStoreSelectedDefault } from '../../../../../store/impl/selectedDefault';


// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

// DB types
import {
  DIED_STILLBORN,
  REGISTRATION_BIRTH_NOTIFY,
  REGISTRATION_DIED_AT_BIRTH,
  InsertAnimalTableInput,
  InsertWeightRecordInput,
  getActiveScrapieFlockNumberId,
  getAnimalIdentification,
  getBirthTypeByDisplayOrder,
  getBreederFromOwnershipHistory,
  getDefaultFlockBookId,
  getFlockPrefixByAnimalIdFromRegistration,
  getFlockPrefixIdByMembershipNumber,
  getOwnerAtBirth,
  getRegistryCompanyIdForMembershipNumber,
  getSexById,
  incrementLastBirthNotifyValue,
  incrementLastDiedAtBirthValue,
  insertAnimalFlockTableRow,
  insertAnimalGoesToLocation,
  insertAnimalIdInfoRow,
  insertAnimalRegistrationRow,
  insertBirthOwnershipRecord,
  insertGeneticCoatRow,
  insertIntoAnimalTable,
  insertWeightRecord,
  writeAnimalBreedPercentages,
} from '../../../../../database';


// mappings
import { mapBirthNotificationToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput';
import { mapRegistryRowToWeightRecordInput } from './mappings/registryRowToWeightRecordInput';
import { mapRegistryRowToFedTagInput } from './mappings/ids/registryRowToFedTagInput';
import { mapRegistryRowToFarmTagInput } from './mappings/ids/registryRowToFarmTagInput';
import {
  AnimalIdentification,
  BirthType,
  DefaultSettingsResults,
  FlockPrefix,
  Owner,
  OwnerType,
} from '@app/api';
import {validateBirthRows} from "../validation/birthValidator";


export async function validateAndProcessBirths(db: Database, birthRecord: BirthRecord, species: Species): Promise<Result<ProcessSuccess, ProcessFailure>> {
  const validationAnswer : ValidationResult[] = await validateBirthRows(db, birthRecord, species);

  const hasInvalid = validationAnswer.some(v => !v.isValid);

  if (hasInvalid) {
    // Map each invalid row into a readable message
    const errors = validationAnswer
      .filter(v => !v.isValid)
      .flatMap(v =>
        v.errors.map(err => `Birth ${v.rowIndex + 1}: ${err}`)  // add 1 to index to make it more understandable to non-programming users
      );

    return new Failure({
      errors
    });
  }

  return processBirthRows(db, birthRecord, species);
}


export async function processBirthRows(db: Database, birthRecord: BirthRecord, species : Species): Promise<Result<ProcessSuccess, ProcessFailure>> {

  let rawDb = db.raw()

  try {
    await beginTransaction(rawDb);

    let selectedDefault : DefaultSettingsResults | null = getStoreSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Setting is Set");
    }

    let rows : BirthNotification[] = birthRecord.rows;
    
    ///////////////////////////////////////////////////////////////
    // determine how many non-stillborn animals there are
    let numStillborn : number = 0;

    for (const row of rows) {
      if (row.isStillborn) {
        numStillborn += 1;
      }
    }

    let numNotStillborn : number = rows.length - numStillborn;

    ///////////////////////////////////////////////////////////////
    // determine the rear type of the living animals
    const rearType : BirthType = await unwrapOrThrow(getBirthTypeByDisplayOrder(rawDb, numNotStillborn));

    ///////////////////////////////////////////////////////////////
    // determine the birth type of all animals, regardless of being stillborn or not
    // rear type is how many animals are being processed
    const birthType : BirthType = await unwrapOrThrow(getBirthTypeByDisplayOrder(rawDb, rows.length));

    let stillbornIteration : number = 0; // this gets incremented by 1 at the start of any stillborn handling

    for (const row of rows) {
      try {

        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        let animalTableInput: InsertAnimalTableInput = mapBirthNotificationToInsertAnimalInput(row, birthType);

        if (row.isStillborn) {
          stillbornIteration++;

          // overwrite the name 
          animalTableInput.name = await craftStillbornName(db, row, stillbornIteration);
          animalTableInput.deathReasonId = DIED_STILLBORN;
          animalTableInput.deathDate = birthDateString; // death date us the same as brith date for stillborns
          animalTableInput.rearType = null; // stillborn --> rear type should be NULL in the DB
        } else {
          animalTableInput.rearType = rearType; // not stillborn --> the reartype is what is determined from above
        }
       
        let newAnimalId : string = await insertIntoAnimalTable(rawDb, animalTableInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert weight row into animal_evaluations_table
        let weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);

        if (weightInput.weight > 0.0) {
          await insertWeightRecord(rawDb, weightInput);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert into breed table
        const damId : string = row.damId;
        const sireId : string = row.sireId;
        await writeAnimalBreedPercentages(
          rawDb,
          newAnimalId,
          damId,
          sireId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder

        const breeder : Owner = await unwrapOrThrow(
          getBreederFromOwnershipHistory(
            rawDb,
            damId,
            species.id,
            birthDate,
          )
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Flock Prefix Id
        const flockPrefixId : string = await unwrapOrThrow(
          getFlockPrefixIdByMembershipNumber(rawDb, breeder.flockId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add to flock table

        await insertAnimalFlockTableRow(
          rawDb,
          newAnimalId,
          flockPrefixId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add into animal_genetic_characteristic_table for coat color

        let coatColorId : string = row.coatColor.id;

        await insertGeneticCoatRow(
          rawDb,
          newAnimalId,
          coatColorId,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get owner at birth of child

        const owner : Owner = await unwrapOrThrow(
          getOwnerAtBirth(
            rawDb,
            damId,
            birthDate,
          )
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert row into animal location history table
        await insertAnimalGoesToLocation(
          rawDb,
          newAnimalId,
          null,
          owner.premise.id,
          birthDateString,
        );

        if (row.isStillborn) {
          // stillborn animals need to go from the premise they were born at to `null`
          await insertAnimalGoesToLocation(
            rawDb,
            newAnimalId,
            owner.premise.id,
            null,
            birthDateString,
          );
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert record into animal_ownership_history_table for the animal's birth

        await insertBirthOwnershipRecord(
          rawDb,
          newAnimalId,
          owner,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the most recent registration number (incrememnted by 1)

        let newRegistrationNumber : string;

        if (row.isStillborn) {

          newRegistrationNumber = await unwrapOrThrow(
            incrementLastDiedAtBirthValue(rawDb)
          );

        } else {

          newRegistrationNumber = await unwrapOrThrow(
            incrementLastBirthNotifyValue(rawDb)
          );

        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID
        let regCompanyId : string = await unwrapOrThrow(
          getRegistryCompanyIdForMembershipNumber(rawDb, owner.flockId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get flock book ID

        let flockBookId : string = await unwrapOrThrow(
          getDefaultFlockBookId(rawDb, regCompanyId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add animal to animal_registration_table

        let regTypeUUID : string = row.isStillborn ? REGISTRATION_DIED_AT_BIRTH : REGISTRATION_BIRTH_NOTIFY;

        await insertAnimalRegistrationRow(
          rawDb,
          breeder,
          newAnimalId,
          animalTableInput.name,
          newRegistrationNumber,
          regCompanyId,
          flockBookId,
          regTypeUUID,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add IDs to the DB

        let ownerId : string;
        
        if (owner.type == OwnerType.CONTACT) {
          ownerId = owner.contact.id;
        } else if (owner.type == OwnerType.COMPANY) {
          ownerId = owner.company.id;
        } else {
          throw new Error("Invalid OwnerType in birthProcessor");
        }

        
        let scrapieId : string | null = await unwrapOrThrow(
          getActiveScrapieFlockNumberId(rawDb, ownerId)
        );

        if (!row.isStillborn) {
          if (hasFedTagInfo(row)) {
            let fedTagInput = mapRegistryRowToFedTagInput(row, newAnimalId, scrapieId);
            await insertAnimalIdInfoRow(rawDb, fedTagInput);
          }

          if (hasFarmTagInfo(row)) {
            let farmTagInput = mapRegistryRowToFarmTagInput(row, newAnimalId);
            await insertAnimalIdInfoRow(rawDb, farmTagInput);
          }
        }

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.animalName}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction(rawDb);
    return new Success({
      numberProcessed: rows.length
    });

  } catch (error) {
    await rollbackTransaction(rawDb);
    return new Failure({
      errors: [(error as Error).message],
    });
  }
}

async function craftStillbornName(db: Database, bn: BirthNotification, iteration: number): Promise<string> {
  const birthDateString: string = bn.birthdate;
  const birthDate: Date = new Date(birthDateString);
  var birthYear : string = birthDate.getFullYear().toString();

  const damId : string = bn.damId;
  const damIdResult = await getAnimalIdentification(db.raw(), damId);

  if (damIdResult.tag === 'error') {
    const errMsg : string = damIdResult.error;
    console.error("Failed to fetch AnimalIdentification:", errMsg);
    throw new Error(errMsg);
  }

  let damIdentification : AnimalIdentification = damIdResult.data;

  //////////////////////////////////////////////////////////
  // get flock prefix of dam
  
  const fpResult = await getFlockPrefixByAnimalIdFromRegistration(db.raw(), damId);

  if (fpResult.tag === 'error') {
    const errMsg : string = fpResult.error;
    console.error("Failed to fetch flockPrefix:", errMsg);
    throw new Error(errMsg);
  }

  let flockPrefix : FlockPrefix = fpResult.data;

  //////////////////////////////////////////////////////////
  // get sex from DB

  const stillbornSexUUID = bn.sex.id;

  let stillbornSexResult = await getSexById(db.raw(), stillbornSexUUID);

  if (stillbornSexResult.tag === 'error') {
    const errMsg : string = stillbornSexResult.error;
    console.error("Failed to fetch stillbornSex:", errMsg);
    throw new Error(errMsg);
  }

  let stillbornSex : Sex = stillbornSexResult.data;

  // formula --> `YYYY-flock prefix Dam_name-Stillborn-sex_abbrev-number`
  return `${birthYear}-${flockPrefix.name} ${damIdentification.name}-Stillborn-${stillbornSex.abbreviation}-${iteration}`;
}

// -----------------------------------------------------
// tag functions

function hasTagInfo(
  typeKey?: string | null,
  colorKey?: string | null,
  locKey?: string | null,
  num?: string | null
): boolean {
  if (!typeKey || !colorKey || !locKey || !num) {
    return false;
  }

  if (!isUUIDv4(typeKey)) return false;
  if (!isUUIDv4(colorKey)) return false;
  if (!isUUIDv4(locKey)) return false;

  // number verification handled elsewhere
  return true;
}

// Semantic wrappers for readability
function hasFarmTagInfo(row: RegistryRow): boolean {
  return hasTagInfo(row.farmTypeKey, row.farmColorKey, row.farmLocKey, row.farmNum);
}

function hasFedTagInfo(row: RegistryRow): boolean {
  return hasTagInfo(row.fedTypeKey, row.fedColorKey, row.fedLocKey, row.fedNum);
}
