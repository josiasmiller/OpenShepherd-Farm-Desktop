import { Failure, handleResult, Result, Success } from '@common/core';
import { ExistingMemberBuyer, NewBuyer, SellerInfo,  Owner, CoatColor, OwnerType,  TransferRecord, ValidationResult } from '@app/api';


import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction
} from '../../../../../database/dbUtils';

import { 
  deleteAnimalForSaleEntry,
  getBreeder,
  getCoatColorForAnimal,
  getDefaultFlockBookId,
  getOwnerById,
  getRegistrationTypeIdByRegNum,
  insertAnimalGoesToLocation,
  insertNewRegistryCertificateRow,
  insertTransferOfOwnershipRecord,
  ID_TRANSFER_REASON_TRANSFERRED_BREEDING,
} from '../../../../../database';
import {Database} from "sqlite3";

import { validateTransferRows } from '../validation/transferValidator'; // change import??


export async function validateAndProcessTransfers(db: Database, transferRecord: TransferRecord): Promise<Result<number, string>> {
  const validationAnswer : ValidationResult[] = await validateTransferRows(db, transferRecord);

  // verify OK then process or ret

  return processTransfers(db, transferRecord);
}



/**
 * processes transfer rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param db The Database to act on
 * @param transferRecord the transfer data being processed
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processTransfers(db: Database, transferRecord: TransferRecord): Promise<Result<number, string>> {

  if (isNewBuyer(transferRecord.buyer)) {
    throw new Error("New Buyers not yet supported"); // this should be handled higher in the stack --> we should never get a New Buyer here YET (until they are implemented)
  }

  // using this until new buyers are implemented
  let buyer : ExistingMemberBuyer = transferRecord.buyer as ExistingMemberBuyer; // we know this is an existing member due to the isNewBuyer check above ^^
  let seller : SellerInfo = transferRecord.seller;
  
  try {
    await beginTransaction(db);

    for (const animalInfo of transferRecord.animals) {
      
      try {
        let locationResult = await insertAnimalGoesToLocation(
          db,
          animalInfo.animalId,
          seller.premiseId,
          buyer.premiseId,
          seller.movedAt,
        );

        if (locationResult.tag == "error") {
          throw new Error(locationResult.error);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////
        // get the seller Owner from the DB

        let sellerType : OwnerType;
        let sellerId : string;

        if (seller.contactId && seller.companyId) {
          throw new Error("SellerInfo has both a contact and company ID");
        }

        if (seller.contactId) {
          sellerId = seller.contactId;
          sellerType = OwnerType.CONTACT;
        } else if (seller.companyId) {
          sellerId = seller.companyId;
          sellerType = OwnerType.COMPANY;
        } else {
          throw new Error("Seller must have either contactId or companyId");
        }

        const sellerOwnerResult = await getOwnerById(
          db,
          sellerId,
          sellerType,
        );

        let sellerOwner: Owner | null = null;

        await handleResult(sellerOwnerResult, {
          success: (data: Owner) => {
            sellerOwner = data;
          },
          error: (err: string) => {
            console.error("Failed to retrieve seller owner:", err);
            throw new Error(err);
          },
        });

        sellerOwner = sellerOwner!;

        ///////////////////////////////////////////////////////////////////////////////////////////
        // get the buyer Owner from the DB

        let buyerType : OwnerType;
        let buyerId : string;

        if (buyer.contactId && buyer.companyId) {
          throw new Error("ExistingMemberBuyer has both a contact and company ID");
        }

        if (buyer.contactId) {
          buyerId = buyer.contactId;
          buyerType = OwnerType.CONTACT;
        } else if (buyer.companyId) {
          buyerId = buyer.companyId;
          buyerType = OwnerType.COMPANY;
        } else {
          throw new Error("Buyer must have either contactId or companyId");
        }

        const buyerOwnerResult = await getOwnerById(
          db,
          buyerId,
          buyerType,
        );

        let buyerOwner: Owner | null = null;

        await handleResult(buyerOwnerResult, {
          success: (data: Owner) => {
            buyerOwner = data;
          },
          error: (err: string) => {
            console.error("Failed to retrieve buyer owner:", err);
            throw new Error(err);
          },
        });

        buyerOwner = buyerOwner!;

        let transferOfOwnershipResult = await insertTransferOfOwnershipRecord(
          db,
          animalInfo.animalId,
          sellerOwner,
          buyerOwner,
          seller.soldAt,
          ID_TRANSFER_REASON_TRANSFERRED_BREEDING,
        );

        if (transferOfOwnershipResult.tag == "error") {
          throw new Error(transferOfOwnershipResult.error);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////
        // remove any for sale records from DB for given animal

        await deleteAnimalForSaleEntry(db, animalInfo.animalId);

        ///////////////////////////////////////////////////////////////////////////////////////////
        // get breeder for insertion into animal registration row
        const breederResult = await getBreeder(db, animalInfo.animalId);
        let breeder: Owner | null = null;

        await handleResult(breederResult, {
          success: (data: Owner) => {
            breeder = data;
          },
          error: (err: string) => {
            console.error("Failed to retrieve breeder:", err);
            throw new Error(err);
          },
        });

        breeder = breeder!;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get the registry company ID for a given animal via the animal's coat color

        var coatColorResult = await getCoatColorForAnimal(db, animalInfo.animalId);
        let coatColor : CoatColor
        let regCompanyId : string;

        await handleResult(coatColorResult, {
          success: (data: CoatColor) => {
            coatColor = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch animal coat color: ", err);
            throw new Error(err);
          },
        });

        // passed check, we know coatColor is valid here now
        coatColor = coatColor!;
        regCompanyId = coatColor.registryCompanyId;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // get flock book ID

        var flockBookResult = await getDefaultFlockBookId(db, regCompanyId);

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

        // get registration type ID
        const regTypeReuslt = await getRegistrationTypeIdByRegNum(db, animalInfo.registrationNumber);
        let regType : string | null = null;

        await handleResult(regTypeReuslt, {
          success: (data: string) => {
            regType = data;
          },
          error: (err: string) => {
            console.error("Failed to fetch registration type ID: ", err);
            throw new Error(err);
          },
        });

        regType = regType!;


        let certificateResult = await insertNewRegistryCertificateRow(
          db,
          animalInfo.animalId,
          regCompanyId,
          regType,
        );
        if (certificateResult.tag == "error") {
          throw new Error(certificateResult.error);
        }

      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${animalInfo.name}": ${(innerError as Error).message}`);
      }
    }

    await commitTransaction(db);
    return new Success(transferRecord.animals.length);

  } catch (error) {
    await rollbackTransaction(db);
    return new Failure((error as Error).message);
  }
}

function isNewBuyer(buyer: ExistingMemberBuyer | NewBuyer): buyer is NewBuyer {
  return buyer.type == 'NewBuyer';
}
