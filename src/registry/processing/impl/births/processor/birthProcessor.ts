import { RegistryRow, ProcessingResult } from '../../../core/types';
import { getStoreSelectedDefault } from '../../../../../main/store/impl/selectedDefault';
import { handleResult, Result } from '../../../../../shared/results/resultTypes';

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

// DB types
import {
  AnimalIdentification,
  BirthType,
  DIED_STILLBORN,
  DefaultSettingsResults,
  FlockPrefix,
  InsertAnimalTableInput,
  InsertWeightRecordInput,
  Owner,
  REGISTRATION_BIRTH_NOTIFY,
  REGISTRATION_DIED_AT_BIRTH,
  Sex,
  Species,
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
import { OwnerType } from '../../../../../database/client-types';

export async function processBirthRows(rows: RegistryRow[], species : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    var selectedDefault : DefaultSettingsResults | null = getStoreSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Setting is Set");
    }

    ///////////////////////////////////////////////////////////////
    // determine the rear type of the living animals
    let numStillborn : number = 0

    for (const row of rows) {
      if (row.isStillborn) {
        numStillborn += 1;
      }
    }

    let numNotStillborn : number = rows.length - numStillborn;
    var rearType : BirthType | null = null;

    if (numNotStillborn > 0) {
      var rearTypeResult : Result<BirthType, string> = await getBirthTypeByDisplayOrder(numNotStillborn);
      
      await handleResult(rearTypeResult, {
        success: (data: BirthType) => {
          rearType = data;
        },
        error: (err: string) => {
          console.error("Failed to fetch Rear Type:", err);
          throw new Error(err);  // convert string to Error
        },
      });

      rearType = rearType!;
    }

    // end finding rear type of animal
    ///////////////////////////////////////////////////////////////

    let stillbornIteration : number = 0;

    for (const row of rows) {
      try {

        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        let animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);

        if (row.isStillborn) {
          stillbornIteration++;

          // generate stillborn name
          let stillbornName : string = await craftStillbornName(row, stillbornIteration);

          // overwrite the name 
          animalTableInput.name = stillbornName;
          animalTableInput.deathReasonId = DIED_STILLBORN;
          animalTableInput.deathDate = birthDateString; // death date us the same as brith date for stillborns
        } else {
          animalTableInput.rearType = rearType; // not stillborn-- so add rear type
        }

       
        let newAnimalId : string = await insertIntoAnimalTable(animalTableInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert weight row into animal_evaluations_table
        let weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);
        await insertWeightRecord(weightInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert into breed table
        const damId : string = row.damId;
        const sireId : string = row.sireId;
        await writeAnimalBreedPercentages(
          newAnimalId,
          damId,
          sireId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder
        let breederResult = await getBreederFromOwnershipHistory(
          damId,
          species.id,
          birthDate,
        );

        let breeder : Owner;

        await handleResult(breederResult, {
          success: (data: Owner) => {
            breeder = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch Breeder:", err);
            throw new Error(err);
          },
        });

        // we are certain breeder is not null/undefined at this point
        breeder = breeder!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Flock Prefix Id

        let fpResult = await getFlockPrefixIdByMembershipNumber(breeder.flockId); // note flockId == membershipNumber
        let flockPrefixId : string;

        await handleResult(fpResult, {
          success: (data: string) => {
            flockPrefixId = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch flockPrefixId:", err);
            throw new Error(err);
          },
        });

        // certain at this point that flock prefix has been set due to the above handleResult
        flockPrefixId = flockPrefixId!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add to flock table

        await insertAnimalFlockTableRow(
          newAnimalId,
          flockPrefixId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add into animal_genetic_characteristic_table for coat color

        let coatColorId : string = row.coatColorKey;

        await insertGeneticCoatRow(
          newAnimalId,
          coatColorId,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get owner at birth of child

        let ownerResult = await getOwnerAtBirth(
          damId,
          birthDate,
        );

        let owner : Owner;

        await handleResult(ownerResult, {
          success: (data: Owner) => {
            owner = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch owner: ", err);
            throw new Error(err);
          },
        });

        // passed check, convert owner to not be possibly undefined
        owner = owner!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert row into animal location history table

        await insertAnimalGoesToLocation(
          newAnimalId,
          null,
          owner.premise.id,
          birthDateString,
        );

        if (row.isStillborn) {

          // stillborn animals need to go from the premise they were born at to `null`
          await insertAnimalGoesToLocation(
            newAnimalId,
            owner.premise.id,
            null,
            birthDateString,
          );
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert record into animal_ownership_history_table for the animal's birth

        await insertBirthOwnershipRecord(
          newAnimalId,
          owner,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the most recent registration number (incrememnted by 1)

        let newRegistrationNumber : string;

        let regNumResult : Result<string, string>;

        if (row.isStillborn) {
          regNumResult = await incrementLastDiedAtBirthValue();
        } else {
          regNumResult = await incrementLastBirthNotifyValue();
        }

        await handleResult(regNumResult, {
          success: (data: string | null) => {

            if (data == null) {
              throw new Error("No recent registration number retrieved. Did the schema or queries change?");
            }

            newRegistrationNumber = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch most recent registration number value: ", err);
            throw new Error(err);
          },
        });

        newRegistrationNumber = newRegistrationNumber!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID

        let regCompanyIdResult = await getRegistryCompanyIdForMembershipNumber(owner.flockId);

        let regCompanyId : string;

        await handleResult(regCompanyIdResult, {
          success: (data: string) => {
            regCompanyId = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch registry company id: ", err);
            throw new Error(err);
          },
        });

        // passed check, convert regCompanyId to not be possibly undefined
        regCompanyId = regCompanyId!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get flock book ID

        let flockBookResult = await getDefaultFlockBookId(regCompanyId);

        let flockBookId : string

        await handleResult(flockBookResult, {
          success: (data: string) => {
            flockBookId = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch flock book id: ", err);
            throw new Error(err);
          },
        });

        // passed check, convert flockBookId to not be possibly undefined
        flockBookId = flockBookId!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add animal to animal_registration_table

        let regTypeUUID : string = row.isStillborn ? REGISTRATION_DIED_AT_BIRTH : REGISTRATION_BIRTH_NOTIFY;

        await insertAnimalRegistrationRow(
          breeder,
          newAnimalId,
          animalTableInput.name,
          newRegistrationNumber,
          birthDateString, //TODO --> determine what day to register? just do "today"?
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
        }

        ownerId = ownerId!;

        let scrapieResult = await getActiveScrapieFlockNumberId(ownerId);

        let scrapieId : string | null = null;

        await handleResult(scrapieResult, {
          success: (data: string | null) => {
            scrapieId = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch scrapie id: ", err);
            throw new Error(err);
          },
        });

        // passed check, convert scrapieId to not be possibly undefined
        scrapieId = scrapieId!;

        // stillborn animals do not get tags stored in the DB
        if (!row.isStillborn) {
          let fedTagInput = mapRegistryRowToFedTagInput(row, newAnimalId, scrapieId);
          await insertAnimalIdInfoRow(fedTagInput);

          let farmTagInput = mapRegistryRowToFarmTagInput(row, newAnimalId);
          await insertAnimalIdInfoRow(farmTagInput);
        }

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.animalName}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction();
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction();
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

async function craftStillbornName(row: RegistryRow, iteration: number): Promise<string> {
  const birthDateString: string = row.birthdate;
  const birthDate: Date = new Date(birthDateString);
  var birthYear : string = birthDate.getFullYear().toString();

  const damId : string = row.damId;

  const damIdResult = await getAnimalIdentification(damId);
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
  
  const fpResult = await getFlockPrefixByAnimalIdFromRegistration(damId);
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

  let stillbornSexResult = await getSexById(stillbornSexUUID);
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
  let ret = `${birthYear}-${flockPrefix.name} ${damIdentification.name}-Stillborn-${sexInitial}`;
  if (iteration != 0) {
    ret += `-${iteration}`;
  }
  return ret;
}
  