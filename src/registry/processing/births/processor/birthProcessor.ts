import { RegistryRow, ProcessingResult } from '../../core/types';
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../database/dbUtils.js';

import { 
  BirthType,
  DefaultSettingsResults,
  getSpecificBirthType,
  InsertAnimalTableInput,
  insertIntoAnimalTable
} from '../../../../database/index.js';

import { mapRegistryRowToInsertAnimalInput } from './mappings/registryRowToAnimalTableInput.js';
import { getSelectedDefault } from '../../../../main/store/selectedDefaultStore.js';
import { handleResult, Result } from '../../../../shared/results/resultTypes.js';


export async function processBirthRows(rows: RegistryRow[]): Promise<ProcessingResult> {
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
        var animalTableInput: InsertAnimalTableInput = mapRegistryRowToInsertAnimalInput(row);
        animalTableInput.rearType = rearType!;
        await insertIntoAnimalTable(animalTableInput);

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
