import { RegistryRow, ProcessingResult } from '../../../core/types';
import { getSelectedDefault } from '../../../../../main/store/selectedDefaultStore.js';
import { handleResult } from '../../../../../shared/results/resultTypes.js';

import { incrementRegisteredValue } from "../../../helpers/registryHelpers.js";

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils.js';

// DB types
import {
  DefaultSettingsResults,
  insertAnimalRegistrationRow,
  Species,
  getBreeder,
  getOwner,
  Owner,
  getRegistryCompanyIdForMembershipNumber,
  getDefaultFlockBookId,
  updateAnimalName,
  incrementLastRegistrationNumber,
  markRegistryCertificateNotPrinted,
  getLastRegisteredValue,
} from '../../../../../database/index.js';

export async function processRegistrationRows(rows: RegistryRow[], _ : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    var selectedDefault : DefaultSettingsResults | null = getSelectedDefault();
    if (!selectedDefault) {
      throw new Error("No Default Settings is Set");
    }

    for (const row of rows) {
      try {

        const animalId : string = row.animalId;
        const animalName : string = row.animalName;
        const birthDateString: string = row.birthdate;
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder
        var breederResult = await getBreeder(animalId);

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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get Owner
        var ownerResult = await getOwner(animalId);

        var owner : Owner;

        await handleResult(ownerResult, {
          success: (data: Owner) => {
            owner = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch Owner:", err);
            throw new Error(err);
          },
        });

        owner = owner!;

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
        // get the most recent Birth Notify Number

        var registeredValResult = await getLastRegisteredValue();
        var mostRecentRegisteredValue : string;

        await handleResult(registeredValResult, {
          success: (data: string | null) => {

            if (data == null) {
              throw new Error("No recent Birth Notify value retrieved. Did the schema or queries change?");
            }

            mostRecentRegisteredValue = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch most recent birth notify value: ", err);
            throw new Error(err);
          },
        });

        mostRecentRegisteredValue = mostRecentRegisteredValue!;
        var newRegisteredValue : string = incrementRegisteredValue(mostRecentRegisteredValue);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // increment the registration number in the DB
        await incrementLastRegistrationNumber(); 

        await insertAnimalRegistrationRow(
          breeder,
          animalId,
          animalName,
          newRegisteredValue,
          birthDateString,
          regCompanyId,
          flockBookId,
        );
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update animal name to match most recent registration name
        await updateAnimalName(
          animalId,
          animalName,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Add a record in the registry_certificate_print_table with the proper registration company and type and the create and modified dates
        await markRegistryCertificateNotPrinted(
          animalId,
        );

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

