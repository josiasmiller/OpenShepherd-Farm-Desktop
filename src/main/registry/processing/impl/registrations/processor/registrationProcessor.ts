import log from "electron-log"
import { handleResult } from '@common/core';
import { 
  Owner, 
  Species, 
  CoatColor, 
  RegistryType, 
  ScrapieFlockInfo,
  RegistryRow, 
  ProcessingResult,
} from '@app/api';

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

// DB types
import {
  insertAnimalRegistrationRow,
  getBreederById,
  getRegistryCompanyIdForMembershipNumber,
  getDefaultFlockBookId,
  updateAnimalName,
  incrementLastRegistrationNumber,
  markRegistryCertificateNotPrinted,
  getCoatColorForAnimal,
  registryTypeToUuid,
  insertAnimalIdInfoRow,
  getScrapieFlockInfo,
  isOwnerCompany,
} from '../../../../../database';
import { mapRegistryRowToFedTagInput } from './mappings/registryRowToFedTagInput';
import {Database} from "@database/async";

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param db The Database to act on
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processRegistrationRows(db: Database, sections: Record<string, RegistryRow[]>, _ : Species): Promise<ProcessingResult> {

  const rawDb = db.raw();

  try {
    await beginTransaction(rawDb);

    let rows : RegistryRow[] = sections.registration_records;

    for (const row of rows) {
      try {

        const animalId : string = row.animalId;
        const animalName : string = row.animalName;
        const birthDateString: string = row.birthdate;
        const breederId : string = row.breederId;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // determine if breederId is for an contact or company

        let isCompany : boolean = false;
        let isCompanyResult = await isOwnerCompany(rawDb, breederId);

        await handleResult(isCompanyResult, {
          success: (data: boolean) => {
            isCompany = data;
          },
          error: (err: string) => {
            log.error("Failed to fetch if owner is a contact or company:", err);
            throw new Error(err);
          },
        });
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add federal tag to DB

        if (hasFederalTagInfo(row)) {

          // get scrapie flock information for tag
          const scrapieResult = await getScrapieFlockInfo(
            rawDb,
            breederId,
            isCompany,
          );

          if (scrapieResult.tag === "error") {
            log.error("Failed to fetch ScrapieFlockInfo:", scrapieResult.error);
            throw new Error(scrapieResult.error);
          }

          let sfi: ScrapieFlockInfo | null = scrapieResult.data;

          let scrapieId : string | null = null;

          if (sfi != null) {
            scrapieId = sfi.flockNumberId;
          }

          const fedTagInput = mapRegistryRowToFedTagInput(row, animalId, scrapieId);

          // check if an existing tag already exists

          await insertAnimalIdInfoRow(rawDb, fedTagInput);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder

        let breeder : Owner;
        let breederResult = await getBreederById(rawDb, breederId, isCompany);

        await handleResult(breederResult, {
          success: (data: Owner) => {
            breeder = data;
          },
          error: (err: string) => {
            log.error("Failed to fetch Breeder:", err);
            throw new Error(err);
          },
        });

        // we are certain breeder is not null/undefined at this point
        breeder = breeder!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID for a given animal via the animal's coat color

        let coatColorResult = await getCoatColorForAnimal(rawDb, animalId);
        let coatColor : CoatColor
        let regCompanyId : string;

        await handleResult(coatColorResult, {
          success: (data: CoatColor) => {
            coatColor = data;
          },
          error: (err: string) => {
            log.error("Failed to fetch animal coat color: ", err);
            throw new Error(err);
          },
        });

        // passed check, we know coatColor is valid here now
        coatColor = coatColor!;
        regCompanyId = coatColor.registryCompanyId;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get flock book ID

        let flockBookResult = await getDefaultFlockBookId(rawDb, regCompanyId);
        let flockBookId : string

        await handleResult(flockBookResult, {
          success: (data: string) => {
            flockBookId = data;
          },
          error: (err: string) => {
            log.error("Failed to fetch flock book id: ", err);
            throw new Error(err);
          },
        });

        // passed check, convert flockBookId to not be possibly undefined
        flockBookId = flockBookId!;

        /////////////////////////////////////////////////////////////////////
        // get next registered number to put into DB
        let { newRegNum, registrationTypeId } = await handleRegistrationNumber(db, animalId);

        let insertRegRowResult = await insertAnimalRegistrationRow(
          rawDb,
          breeder,
          animalId,
          animalName,
          newRegNum,
          regCompanyId,
          flockBookId,
          registrationTypeId,
        );

        if (insertRegRowResult.tag == 'error') {
          throw new Error(insertRegRowResult.error);
        }
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // update animal name to match most recent registration name
        await updateAnimalName(
          rawDb,
          animalId,
          animalName,
        );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Add a record in the registry_certificate_print_table with the proper registration company and type and the create and modified dates
        await markRegistryCertificateNotPrinted(
          rawDb, animalId,
        );

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${row.animalName}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction(rawDb);
    return {
      success: true,
      insertedRowCount: rows.length
    };

  } catch (error) {
    await rollbackTransaction(rawDb);
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}

/**
 * This function:
 *  - gets the coat color of the given animal to determine which registry to use
 *  - uses the registration type to incrememnt the appropriate registration value
 *  - returns the new incremented value to use as well as the registrationTypeUUID
 *
 * @param db The Database to act on
 * @param animalId UUID of animal being sought
 * @returns incremented registration value of the correct registration type
 *          For example:
 *          - white registry     --> 'W-0012' 
 *          - chocolate registry --> 'C-0123'
 *          - black registry     --> '012345'
 */
async function handleRegistrationNumber(db: Database, animalId : string): Promise<{ newRegNum : string, registrationTypeId : string}> {

  let ccResult = await getCoatColorForAnimal(db.raw(), animalId);

  let coatColor : CoatColor;

  await handleResult(ccResult, {
    success: (data: CoatColor) => {

      if (data == null) {
        throw new Error(`No coat color for animalId=\'${animalId}\'`);
      }

      coatColor = data;
    },
    error: (err: string) => {
      log.error(`Failed to fetch coat color for animalId=\'${animalId}\': `, err);
      throw new Error(err);
    },
  });

  coatColor = coatColor!;

  // get the registration type from the coat color
  let ccLower : string = coatColor.name.toLowerCase();
  let registrationUuid : string = registryTypeToUuid(ccLower as RegistryType);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // increment the registration number in the DB

  let registeredValResult = await incrementLastRegistrationNumber(db.raw(), registrationUuid);
  let newRegisteredValue : string;

  await handleResult(registeredValResult, {
    success: (data: string | null) => {

      if (data == null) {
        throw new Error("No recent Registration value retrieved. Did the schema or queries change?");
      }

      newRegisteredValue = data;
    },
    error: (err: string) => {
      log.error("Failed to fetch most recent birth notify value: ", err);
      throw new Error(err);
    },
  });

  newRegisteredValue = newRegisteredValue!;
  return { 
    newRegNum: newRegisteredValue,
    registrationTypeId: registrationUuid,
  };
}


/**
 * checks if a given row has all pertinent information required to properly upload a federal tag to the DB
 * 
 * @param row row being processed
 * @returns bool indicating if all required information is present to upload a federal tag to the DB
 */
function hasFederalTagInfo(row: RegistryRow): boolean {
  
  // extract data from registry row
  const fedType: string = row.fedType;
  if (!fedType) {
    return false;
  }

  if (fedType.toLowerCase() != 'federal scrapie' && fedType.toLowerCase() != 'electronic') {
    return false; // not a federal scrapie, not official?
  }

  const breederid = row.breederId;
  if (!breederid) {
    return false;
  }

  const idType = row.fedTypeKey;
  if (!idType) {
    return false;
  }

  const idColor =  row.fedColorKey;
  if (!idColor) {
    return false;
  }

  const idLocation = row.fedLocKey;
  if (!idLocation) {
    return false;
  }

  const dateOn = row.birthdate;
  if (!dateOn) {
    return false;
  }

  const idValue = row.fedNum;
  if (!idValue) {
    return false;
  }

  const isOfficial = row.isOfficial;
  if (!isOfficial) {
    return false;
  }
  
  return true;
}
