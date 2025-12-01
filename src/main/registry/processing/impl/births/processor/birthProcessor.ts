import {Database} from "sqlite3";
import { handleResult, Result, unwrapOrThrow, isUUIDv4 } from '@common/core';
import { RegistryRow, Sex, Species, ProcessingResult } from '@app/api';
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
import { mapRegistryRowToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput';
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
// import { unwrapOrThrow } from 'packages/core/src/resultTypes';


export async function processBirthRows(db: Database, sections: Record<string, RegistryRow[]>, species : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction(db);

    var selectedDefault : DefaultSettingsResults | null = getStoreSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Setting is Set");
    }

    let rows : RegistryRow[] = sections.birth_records;
    
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
    const rearType : BirthType = await unwrapOrThrow(getBirthTypeByDisplayOrder(db, numNotStillborn));

    ///////////////////////////////////////////////////////////////
    // determine the birth type of all animals, regardless of being stillborn or not
    // rear type is how many animals are being processed
    const birthType : BirthType = await unwrapOrThrow(getBirthTypeByDisplayOrder(db, rows.length));

    let stillbornIteration : number = 0; // this gets incremented by 1 at the start of any stillborn handling

    for (const row of rows) {
      try {

        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        let animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row, birthType);

        if (row.isStillborn) {
          stillbornIteration++;

          // generate stillborn name
          let stillbornName : string = await craftStillbornName(db, row, stillbornIteration);

          // overwrite the name 
          animalTableInput.name = stillbornName;
          animalTableInput.deathReasonId = DIED_STILLBORN;
          animalTableInput.deathDate = birthDateString; // death date us the same as brith date for stillborns
          animalTableInput.rearType = null; // stillborn --> rear type should be NULL in the DB
        } else {
          animalTableInput.rearType = rearType; // not stillborn --> the reartype is what is determined from above
        }
       
        let newAnimalId : string = await insertIntoAnimalTable(db, animalTableInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert weight row into animal_evaluations_table
        let weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);

        if (weightInput.weight > 0.0) {
          await insertWeightRecord(db, weightInput);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert into breed table
        const damId : string = row.damId;
        const sireId : string = row.sireId;
        await writeAnimalBreedPercentages(
          db,
          newAnimalId,
          damId,
          sireId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder

        const breeder : Owner = await unwrapOrThrow(
          getBreederFromOwnershipHistory(
            db,
            damId,
            species.id,
            birthDate,
          )
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Flock Prefix Id
        const flockPrefixId : string = await unwrapOrThrow(
          getFlockPrefixIdByMembershipNumber(db, breeder.flockId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add to flock table

        await insertAnimalFlockTableRow(
          db,
          newAnimalId,
          flockPrefixId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add into animal_genetic_characteristic_table for coat color

        let coatColorId : string = row.coatColorKey;

        await insertGeneticCoatRow(
          db,
          newAnimalId,
          coatColorId,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get owner at birth of child

        const owner : Owner = await unwrapOrThrow(
          getOwnerAtBirth(
            db,
            damId,
            birthDate,
          )
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert row into animal location history table
        await insertAnimalGoesToLocation(
          db,
          newAnimalId,
          null,
          owner.premise.id,
          birthDateString,
        );

        if (row.isStillborn) {
          // stillborn animals need to go from the premise they were born at to `null`
          await insertAnimalGoesToLocation(
            db,
            newAnimalId,
            owner.premise.id,
            null,
            birthDateString,
          );
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert record into animal_ownership_history_table for the animal's birth

        await insertBirthOwnershipRecord(
          db,
          newAnimalId,
          owner,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the most recent registration number (incrememnted by 1)

        let newRegistrationNumber : string;

        if (row.isStillborn) {

          newRegistrationNumber = await unwrapOrThrow(
            incrementLastDiedAtBirthValue(db)
          );

        } else {

          newRegistrationNumber = await unwrapOrThrow(
            incrementLastBirthNotifyValue(db)
          );

        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID
        let regCompanyId : string = await unwrapOrThrow(
          getRegistryCompanyIdForMembershipNumber(db, owner.flockId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get flock book ID

        let flockBookId : string = await unwrapOrThrow(
          getDefaultFlockBookId(db, regCompanyId)
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add animal to animal_registration_table

        let regTypeUUID : string = row.isStillborn ? REGISTRATION_DIED_AT_BIRTH : REGISTRATION_BIRTH_NOTIFY;

        await insertAnimalRegistrationRow(
          db,
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
          getActiveScrapieFlockNumberId(db, ownerId)
        );

        if (!row.isStillborn) {
          if (hasFedTagInfo(row)) {
            let fedTagInput = mapRegistryRowToFedTagInput(row, newAnimalId, scrapieId);
            await insertAnimalIdInfoRow(db, fedTagInput);
          }

          if (hasFarmTagInfo(row)) {
            let farmTagInput = mapRegistryRowToFarmTagInput(row, newAnimalId);
            await insertAnimalIdInfoRow(db, farmTagInput);
          }
        }

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.animalName}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction(db);
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction(db);
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

async function craftStillbornName(db: Database, row: RegistryRow, iteration: number): Promise<string> {
  const birthDateString: string = row.birthdate;
  const birthDate: Date = new Date(birthDateString);
  var birthYear : string = birthDate.getFullYear().toString();

  const damId : string = row.damId;

  const damIdResult = await getAnimalIdentification(db, damId);
  let damIdentification : AnimalIdentification;

  await handleResult(damIdResult, {
    success: (data: AnimalIdentification) => {
      damIdentification = data;
    },
    error: (err: string) => {
      console.error("Failed to fetch AnimalIdentification:", err);
      throw new Error(err);
    },
  });

  damIdentification = damIdentification!

  //////////////////////////////////////////////////////////
  // get flock prefix of dam
  
  const fpResult = await getFlockPrefixByAnimalIdFromRegistration(db, damId);
  let flockPrefix : FlockPrefix

  await handleResult(fpResult, {
    success: (data: FlockPrefix) => {
      flockPrefix = data;
    },
    error: (err: string) => {
      console.error("Failed to fetch flockPrefix:", err);
      throw new Error(err);
    },
  });

  //////////////////////////////////////////////////////////
  // get sex from DB

  const stillbornSexUUID = row.sexKey;

  let stillbornSexResult = await getSexById(db, stillbornSexUUID);
  let stillbornSex : Sex;

  await handleResult(stillbornSexResult, {
    success: (data: Sex) => {
      stillbornSex = data;
    },
    error: (err: string) => {
      console.error("Failed to fetch stillbornSex:", err);
      throw new Error(err);
    },
  });

  stillbornSex = stillbornSex!

  const sexInitial : string = stillbornSex.name.charAt(0).toUpperCase();

  // formula --> `YYYY-flock prefix Dam_name-Stillborn-sex_abbrev-number`
  let ret = `${birthYear}-${flockPrefix.name} ${damIdentification.name}-Stillborn-${sexInitial}-${iteration}`;
  return ret;
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
