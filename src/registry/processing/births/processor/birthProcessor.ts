import { RegistryRow, ProcessingResult } from '../../core/types';
import { getSelectedDefault } from '../../../../main/store/selectedDefaultStore.js';
import { handleResult, Result } from '../../../../shared/results/resultTypes.js';

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../database/dbUtils.js';

// DB types
import { 
  BirthType,
  DefaultSettingsResults,
  getBreederFromOwnershipHistory,
  getFlockPrefixIdByMembershipNumber,
  getSpecificBirthType,
  InsertAnimalTableInput,
  insertAnimalFlockTableRow,
  insertIntoAnimalTable,
  insertWeightRecord,
  InsertWeightRecordInput,
  Owner,
  Species,
  writeAnimalBreedPercentages,
  insertGeneticCoatRow,
  getOwnerAtBirth,
  insertAnimalGoesToLocation,
  insertBirthOwnershipRecord,
  getLastBirthNotifyValue,
  getRegistryCompanyIdForMembershipNumber,
  getDefaultFlockBookId,
  insertAnimalRegistrationRow,
  incrementLastRegistrationNumber
} from '../../../../database/index.js';

// mappings
import { mapRegistryRowToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput.js';
import { mapRegistryRowToWeightRecordInput } from './mappings/registryRowToWeightRecordInput.js';

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


    for (const row of rows) {
      try {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        var animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);
        animalTableInput.rearType = rearType!;
        var newAnimalId : string = await insertIntoAnimalTable(animalTableInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert weight row into animal_evaluations_table
        var weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);
        await insertWeightRecord(weightInput);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert into breed table
        var damId : string = row.damId;
        var sireId : string = row.sireId;
        await writeAnimalBreedPercentages(
          newAnimalId,
          damId,
          sireId,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder
        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        var breederResult = await getBreederFromOwnershipHistory(
          damId,
          species.id,
          birthDate,
        );

        var breeder : Owner

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
        var flockPrefixId : string

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

        var owner : Owner

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
        // get the most recent Birth Notify Number

        var bnValResult = await getLastBirthNotifyValue();
        var mostRecentBn : string 

        await handleResult(bnValResult, {
          success: (data: string | null) => {

            if (data == null) {
              throw new Error("No recent Birth Notify value retrieved. Did the schema or queries change?");
            }

            mostRecentBn = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch most recent birth notify value: ", err);
            throw new Error(err);
          },
        });

        mostRecentBn = mostRecentBn!;
        var newBNValue : string = incrementBNValue(mostRecentBn);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID

        var regCompanyIdResult = await getRegistryCompanyIdForMembershipNumber(owner.flockId);

        var regCompanyId : string

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

        var animalRegistrationResult = await insertAnimalRegistrationRow(
          breeder,
          newAnimalId,
          animalTableInput.name,
          newBNValue,
          birthDateString, //TODO --> determine what day to register? just do "today"?
          regCompanyId,
          flockBookId,
        );

        await handleResult(animalRegistrationResult, {
          success: (_: null) => {
            // nothing to do
          },
          error: (err: string) => {
            console.error("Failed to insert into animal registration table: ", err);
            throw new Error(err);
          },
        });

    
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // increment the last Birth Notify Value

        await incrementLastRegistrationNumber();

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


function incrementBNValue(bn: string): string {
  const match = bn.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) throw new Error("Invalid format");

  const prefix = match[1];
  const numberStr = match[2];

  const numberLength = numberStr.length;
  const incrementedNumber = (parseInt(numberStr, 10) + 1).toString().padStart(numberLength, '0');

  return `${prefix}${incrementedNumber}`;
}