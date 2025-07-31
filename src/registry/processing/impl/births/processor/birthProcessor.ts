import { RegistryRow, ProcessingResult } from '../../../core/types';
import { getSelectedDefault } from '../../../../../main/store/selectedDefaultStore.js';
import { handleResult, Result } from '../../../../../shared/results/resultTypes.js';

import { incrementBNValue } from "../../../helpers/registryHelpers.js";

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils.js';

// DB types
import {
  AnimalIdentification,
  BirthType,
  DIED_STILLBORN,
  DefaultSettingsResults,
  InsertAnimalTableInput,
  InsertWeightRecordInput,
  Owner,
  Sex,
  Species,
  getActiveScrapieFlockNumberId,
  getAnimalIdentification,
  getBreederFromOwnershipHistory,
  getDefaultFlockBookId,
  getFlockPrefixIdByMembershipNumber,
  getLastBirthNotifyValue,
  getOwnerAtBirth,
  getRegistryCompanyIdForMembershipNumber,
  getSexFromAnimalId,
  getSpecificBirthType,
  incrementLastRegistrationNumber,
  insertAnimalFlockTableRow,
  insertAnimalGoesToLocation,
  insertAnimalIdInfoRow,
  insertAnimalRegistrationRow,
  insertBirthOwnershipRecord,
  insertIntoAnimalTable,
  insertWeightRecord,
  insertGeneticCoatRow,
  writeAnimalBreedPercentages,
  incrementLastBirthNotifyValue,
  REGISTRATION_BIRTH_NOTIFY,
} from '../../../../../database/index.js';


// mappings
import { mapRegistryRowToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput.js';
import { mapRegistryRowToWeightRecordInput } from './mappings/registryRowToWeightRecordInput.js';
import { mapRegistryRowToFedTagInput } from './mappings/ids/registryRowToFedTagInput.js';
import { mapRegistryRowToFarmTagInput } from './mappings/ids/registryRowToFarmTagInput.js';
import { OwnerType } from '../../../../../database/client-types.js';

export async function processBirthRows(rows: RegistryRow[], species : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    var selectedDefault : DefaultSettingsResults | null = getSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Settings is Set");
    }

    var rearTypeResult : Result<BirthType, string> = await getSpecificBirthType(selectedDefault.rear_type);
    var foundDefaultRear : boolean = false;
    var rearType : BirthType;

    await handleResult(rearTypeResult, {
      success: (data: BirthType) => {
        rearType = data;
        foundDefaultRear = true;
      },
      error: (err: string) => {
        console.error("Failed to fetch Rear Type:", err);
        throw new Error(err);  // convert string to Error
      },
    });

    if (!foundDefaultRear) {
      return{
        success: false,
        errors: ["unable to determine \'rear type\' from the default settings."]
      };
    }

    var stillbornIteration : number = 0;


    for (const row of rows) {
      try {

        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        var animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);

        if (row.isStillborn) {
          stillbornIteration++;

          // generate stillborn name
          var stillbornName : string = await craftStillbornName(row, stillbornIteration);

          // overwrite the name 
          animalTableInput.name = stillbornName;
          animalTableInput.deathReasonId = DIED_STILLBORN;
          animalTableInput.deathDate = birthDateString; // death date us the same as brith date for stillborns
        } else {
          animalTableInput.rearType = rearType!; // not stillborn-- so add rear type
        }

       
        var newAnimalId : string = await insertIntoAnimalTable(animalTableInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert weight row into animal_evaluations_table
        var weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);
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
        var breederResult = await getBreederFromOwnershipHistory(
          damId,
          species.id,
          birthDate,
        );

        var breeder : Owner;

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

        var fpResult = await getFlockPrefixIdByMembershipNumber(breeder.flockId); // note flockId == membershipNumber
        var flockPrefixId : string;

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

        var coatColorId : string = row.coatColorKey;

        await insertGeneticCoatRow(
          newAnimalId,
          coatColorId,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get owner at birth of child

        var ownerResult = await getOwnerAtBirth(
          damId,
          birthDate,
        );

        var owner : Owner;

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
          owner.premise.id,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert record into animal_ownership_history_table for the animal's birth

        await insertBirthOwnershipRecord(
          newAnimalId,
          owner,
          birthDateString,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the most recent Birth Notify Number (incrememnted by 1)

        var bnValResult = await incrementLastBirthNotifyValue();
        var newBNValue : string;

        await handleResult(bnValResult, {
          success: (data: string | null) => {

            if (data == null) {
              throw new Error("No recent Birth Notify value retrieved. Did the schema or queries change?");
            }

            newBNValue = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch most recent birth notify value: ", err);
            throw new Error(err);
          },
        });

        newBNValue = newBNValue!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID

        var regCompanyIdResult = await getRegistryCompanyIdForMembershipNumber(owner.flockId);

        var regCompanyId : string;

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

        var flockBookResult = await getDefaultFlockBookId(regCompanyId);

        var flockBookId : string

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

        await insertAnimalRegistrationRow(
          breeder,
          newAnimalId,
          animalTableInput.name,
          newBNValue,
          birthDateString, //TODO --> determine what day to register? just do "today"?
          regCompanyId,
          flockBookId,
          REGISTRATION_BIRTH_NOTIFY,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add IDs to the DB

        var ownerId : string;
        
        if (owner.type == OwnerType.CONTACT) {
          ownerId = owner.contact.id;
        } else if (owner.type == OwnerType.COMPANY) {
          ownerId = owner.company.id;
        }

        ownerId = ownerId!;

        var scrapieResult = await getActiveScrapieFlockNumberId(ownerId);

        var scrapieId : string;

        await handleResult(scrapieResult, {
          success: (data: string) => {
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
          var fedTagInput = mapRegistryRowToFedTagInput(row, newAnimalId, scrapieId);
          await insertAnimalIdInfoRow(fedTagInput);

          var farmTagInput = mapRegistryRowToFarmTagInput(row, newAnimalId);
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

  var damIdResult = await getAnimalIdentification(damId);
  var damIdentification : AnimalIdentification;

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

  var stillbornSexResult = await getSexFromAnimalId(damId);
  var stillbornSex : Sex;

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

  // formula --> `YYYY-Dam_name-Stillborn-sex_abbrev-number`
  var ret = `${birthYear}-${damIdentification.name}-Stillborn-${sexInitial}`;
  if (iteration != 0) {
    ret += `-${iteration}`;
  }
  return ret;
}
  