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
  getSpecificBirthType,
  InsertAnimalTableInput,
  insertIntoAnimalTable,
  insertWeightRecord,
  InsertWeightRecordInput,
  Owner,
  Species,
  writeAnimalBreedPercentages
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

    handleResult(rearTypeResult, {
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
        errors: ["unable to determine \'rear type\' from  the default settings."]
      };
    }


    for (const row of rows) {
      try {

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // insert animal into animalTable
        // var animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);
        // animalTableInput.rearType = rearType!;
        // var newAnimalId : string = await insertIntoAnimalTable(animalTableInput);

        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // // insert weight row into animal_evaluations_table
        // var weightInput : InsertWeightRecordInput = mapRegistryRowToWeightRecordInput(row, newAnimalId);
        // await insertWeightRecord(weightInput);

        // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // // insert into breed table
        var damId : string = row.damId;
        // var sireId : string = row.sireId;
        // await writeAnimalBreedPercentages(
        //   newAnimalId,
        //   damId,
        //   sireId,
        // );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder
        const birthDateString: string = row.birthdate;
        const birthDate: Date = new Date(birthDateString);

        var ownerResult = await getBreederFromOwnershipHistory(
          damId,
          species.id,
          birthDate,
        );

        var breeder : Owner

        handleResult(ownerResult, {
          success: (data: Owner) => {
            breeder = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch Breeder:", err);
            throw new Error(err);  // convert string to Error
          },
        });

        // we are certain breeder is not null/undefined at this point
        breeder = breeder!;

        console.log("MITCH DEBUG!!");
        console.log(breeder);


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // will be adding more insert statements here

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
