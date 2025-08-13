import { RegistryRow, ProcessingResult } from '../../../core/types';
import { handleResult } from '../../../../../shared/results/resultTypes';

// DB actions
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

// DB types
import {
  insertAnimalRegistrationRow,
  Species,
  getBreederById,
  getOwner,
  Owner,
  getRegistryCompanyIdForMembershipNumber,
  getDefaultFlockBookId,
  updateAnimalName,
  incrementLastRegistrationNumber,
  markRegistryCertificateNotPrinted,
  getCoatColorForAnimal,
  CoatColor,
  registryTypeToUuid,
  RegistryType,
  insertAnimalIdInfoRow,
  getScrapieFlockInfo,
  ScrapieFlockInfo,
  isOwnerCompany,
} from '../../../../../database/index';
import { mapRegistryRowToFedTagInput } from './mappings/registryRowToFedTagInput';

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processRegistrationRows(sections: Record<string, RegistryRow[]>, _ : Species): Promise<ProcessingResult> {
  try {
    await beginTransaction();

    var rows : RegistryRow[] = sections.registration_records;

    for (const row of rows) {
      try {

        const animalId : string = row.animalId;
        const animalName : string = row.animalName;
        const birthDateString: string = row.birthdate;
        const breederId : string = row.breederId;

        // determine if breederId is for an contact or company

        let isCompany : boolean = false;
        let isCompanyResult = await isOwnerCompany(breederId);

        await handleResult(isCompanyResult, {
          success: (data: boolean) => {
            isCompany = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch if owner is a contact or company:", err);
            throw new Error(err);
          },
        });
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add federal tag to DB

        if (hasFederalTagInfo(row)) {

          // first check for companies
          const scrapieCompanyResult = await getScrapieFlockInfo(
            breederId,
            isCompany,
          );

          let sfi : ScrapieFlockInfo | null = null;

          await handleResult(scrapieCompanyResult, {
            success: (data: ScrapieFlockInfo | null) => {
              sfi = data;
            },
            error: (err: string) => {
              console.error("Failed to fetch ScrapieFlockInfo:", err);
              throw new Error(err);
            },
          });

          let scrapieId : string | null = null;

          if (sfi != null) {
            scrapieId = sfi.flockNumberId;
          }

          const fedTagInput = mapRegistryRowToFedTagInput(row, animalId, scrapieId);
          await insertAnimalIdInfoRow(fedTagInput);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get breeder

        let breeder : Owner;
        let breederResult = await getBreederById(breederId, isCompany);

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
        // var ownerResult = await getOwner(animalId);

        // var owner : Owner;

        // await handleResult(ownerResult, {
        //   success: (data: Owner) => {
        //     owner = data;
        //   },
        //   error: (err: string) => {
        //     console.error("Failed to fetch Owner:", err);
        //     throw new Error(err);
        //   },
        // });

        // owner = owner!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID

        // var regCompanyIdResult = await getRegistryCompanyIdForMembershipNumber(owner.flockId);
        var regCompanyIdResult = await getRegistryCompanyIdForMembershipNumber(breeder.flockId);

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

        /////////////////////////////////////////////////////////////////////
        // get next registered number to put into DB
        var { newRegNum, registrationTypeId } = await handleRegistrationNumber(animalId);

        var insertRegRowResult = await insertAnimalRegistrationRow(
          breeder,
          animalId,
          animalName,
          newRegNum,
          birthDateString,
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

    // await commitTransaction();
    await rollbackTransaction();
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

/**
 * This function:
 *  - gets the coat color of the given animal to determine which registry to use
 *  - uses the registration type to incrememnt the appropriate registration value
 *  - returns the new incremented value to use as well as the registrationTypeUUID
 * 
 * @param animalId UUID of animal being sought
 * @returns incremented registration value of the correct registration type
 *          For example:
 *          - white registry     --> 'W-0012' 
 *          - chocolate registry --> 'C-0123'
 *          - black registry     --> '012345'
 */
async function handleRegistrationNumber(animalId : string): Promise<{ newRegNum : string, registrationTypeId : string}> {

  var ccResult = await getCoatColorForAnimal(animalId);

  var coatColor : CoatColor;

  await handleResult(ccResult, {
    success: (data: CoatColor) => {

      if (data == null) {
        throw new Error(`No coat color for animalId=\'${animalId}\'`);
      }

      coatColor = data;
    },
    error: (err: string) => {
      console.error(`Failed to fetch coat color for animalId=\'${animalId}\': `, err);
      throw new Error(err);
    },
  });

  coatColor = coatColor!;

  // get the registration type from the coat color
  var ccLower : string = coatColor.name.toLowerCase();
  var registrationUuid : string = registryTypeToUuid(ccLower as RegistryType);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // increment the registration number in the DB

  var registeredValResult = await incrementLastRegistrationNumber(registrationUuid);
  var newRegisteredValue : string;

  await handleResult(registeredValResult, {
    success: (data: string | null) => {

      if (data == null) {
        throw new Error("No recent Registration value retrieved. Did the schema or queries change?");
      }

      newRegisteredValue = data;
    },
    error: (err: string) => {
      console.error("Failed to fetch most recent birth notify value: ", err);
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
