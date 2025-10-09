import { handleResult } from '@common/core';
import { Species, RegistryRow, ProcessingResult, ExistingMemberBuyer, NewBuyer, SellerInfo, AnimalRow, TransferParseResponse, Owner, CoatColor, OwnerType } from '@app/api';

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

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param db The Database to act on
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processTransferRows(db: Database, sections: Record<string, RegistryRow[]>, _: Species): Promise<ProcessingResult> {

  let transferResponse : TransferParseResponse = parseTransferSections(sections);

  if (isNewBuyer(transferResponse.buyer)) {
    throw new Error("New Buyers not yet supported");
  }

  // using this until new buyers are implemented
  let buyer : ExistingMemberBuyer = transferResponse.buyer;
  let seller : SellerInfo = transferResponse.seller;
  
  try {
    await beginTransaction(db);

    for (const animalInfo of transferResponse.animals) {

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

        let sellerOwner : Owner = null;

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
          sellerId = buyer.companyId;
          buyerType = OwnerType.COMPANY;
        } else {
          throw new Error("Buyer must have either contactId or companyId");
        }

        const buyerOwnerResult = await getOwnerById(
          db,
          buyerId,
          buyerType,
        );

        let buyerOwner : Owner = null;

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
        let breeder : Owner = null;

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
        let regType : string = null;

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
    return {
      success: true,
      insertedRowCount: transferResponse.animals.length,
    };

  } catch (error) {
    await rollbackTransaction(db);
    return {
      success: false,
      errors: [(error as Error).message]
    };
  }
}


/**
 * Takes a sections receieved from the processing interface and massages it back into a `TransferParseResponse`. 
 * The keys are hacky for the time being due to how the CSVs are formatted from the website
 * 
 * @param sections information received from the registry processing interface
 * @returns TransferParseResponse
 */
function parseTransferSections(sections: Record<string, RegistryRow[]>): TransferParseResponse {
  // animals
  const animals = (sections.transferred_animals ?? []) as AnimalRow[];

  // seller
  const rawSeller = sections.seller_info?.[0];
  if (!rawSeller) {
    throw new Error("Missing seller_info section");
  }

  const seller: SellerInfo = {
    contactId: normalizeId(rawSeller['CONTACT_ID']),
    companyId: normalizeId(rawSeller['COMPANY_ID']),
    premiseId: rawSeller['PREMISE_ID'],
    soldAt: rawSeller['SOLD_AT'],
    movedAt: rawSeller['MOVED_AT'],
  };

  // buyer
  const rawBuyer = sections.buyer_info?.[0];
  if (!rawBuyer) {
    throw new Error("Missing buyer_info section");
  }

  let buyer: ExistingMemberBuyer | NewBuyer;

  if ('MEMBERSHIP_NUMBER' in rawBuyer) {
    // Existing member
    buyer = {
      membershipNumber: rawBuyer['MEMBERSHIP_NUMBER'],
      contactId: normalizeId(rawBuyer['CONTACT_ID']),
      companyId: normalizeId(rawBuyer['COMPANY_ID']),
      premiseId: rawBuyer['PREMISE_ID'],
      firstName: rawBuyer['FIRST_NAME'],
      lastName: rawBuyer['LAST_NAME'],
      region: rawBuyer['REGION'],
    };
  } else if (' Address 1' in rawBuyer) {
    // New buyer
    buyer = {
      firstName: rawBuyer['First Name'],
      lastName: rawBuyer['Last Name'],
      company: rawBuyer['Company'],
      address1: rawBuyer['Address 1'],
      address2: rawBuyer['Address 2'],
      city: rawBuyer['City'],
      stateKey: rawBuyer['State Key'],
      state: rawBuyer['State'],
      postCode: rawBuyer['Post Code'],
      federalScrapieId: rawBuyer['Federal Scrapie ID (US)'],
      federalPremiseId: rawBuyer['Federal Premise ID'],
      statePremiseId: rawBuyer['State Premise ID'],
      longitude: rawBuyer['Premise Longitude (Decimal Degrees)'],
      latitude: rawBuyer['Premise Latitude (Decimal Degrees)'],
      primaryPhone: rawBuyer['Primary Phone'],
      mobilePhone: rawBuyer['Mobile Phone'],
      email: rawBuyer['Primary Email'],
      website: rawBuyer['Website'],
    };
  } else {
    throw new Error("Invalid buyer_info format --> must be ExistingMemberBuyer or NewBuyer");
  }

  return { animals, seller, buyer };
}

function normalizeId(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" || trimmed.toLowerCase() === "none" ? null : trimmed;
}

function isNewBuyer(buyer: ExistingMemberBuyer | NewBuyer): buyer is NewBuyer {
  return "address1" in buyer;
}
