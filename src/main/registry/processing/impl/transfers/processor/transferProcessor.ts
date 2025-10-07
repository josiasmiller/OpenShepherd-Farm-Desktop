import { handleResult } from 'packages/core';
import { Species, RegistryRow, ProcessingResult, ExistingMemberBuyer, NewBuyer, SellerInfo, AnimalRow, TransferParseResponse, Owner, CoatColor } from 'packages/api';

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

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processTransferRows(sections: Record<string, RegistryRow[]>, _: Species): Promise<ProcessingResult> {

  let transferResponse : TransferParseResponse = parseTransferSections(sections);

  if (isNewBuyer(transferResponse.buyer)) {
    throw new Error("New Buyers not yet supported");
  }

  // using this until new buyers are implemented
  let buyer : ExistingMemberBuyer = transferResponse.buyer;
  let seller : SellerInfo = transferResponse.seller;


  try {
    await beginTransaction();

    for (const animalInfo of transferResponse.animals) {

      try {
        let locationResult = await insertAnimalGoesToLocation(
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

        const sellerId = seller.contactId ?? seller.companyId;
        if (!sellerId) {
          throw new Error("Seller must have either contactId or companyId");
        }

        const sellerOwnerResult = await getOwnerById(sellerId);
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

        const buyerId = buyer.contactId ?? buyer.companyId;
        if (!buyerId) {
          throw new Error("Buyer must have either contactId or companyId");
        }

        const buyerOwnerResult = await getOwnerById(buyerId);
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
          animalInfo.animalId,
          sellerOwner,
          buyerOwner,
          seller.movedAt,
          ID_TRANSFER_REASON_TRANSFERRED_BREEDING,
        );

        if (transferOfOwnershipResult.tag == "error") {
          throw new Error(transferOfOwnershipResult.error);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////
        // remove any for sale records from DB for given animal

        await deleteAnimalForSaleEntry(animalInfo.animalId);

        ///////////////////////////////////////////////////////////////////////////////////////////
        // get breeder for insertion into animal registration row
        const breederResult = await getBreeder(animalInfo.animalId);
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

        var coatColorResult = await getCoatColorForAnimal(animalInfo.animalId);
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

        // get registration type ID
        const regTypeReuslt = await getRegistrationTypeIdByRegNum(animalInfo.registrationNumber);
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

    await commitTransaction();
    return {
      success: true,
      insertedRowCount: transferResponse.animals.length,
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
    contactId: normalizeId(rawSeller['Seller ContactID']),
    companyId: normalizeId(rawSeller['Seller CompanyID']),
    premiseId: rawSeller['Seller Premise ID'],
    soldAt: rawSeller[' Sold At'],
    movedAt: rawSeller['Moved At'],
  };

  // buyer
  const rawBuyer = sections.buyer_info?.[0];
  if (!rawBuyer) {
    throw new Error("Missing buyer_info section");
  }

  let buyer: ExistingMemberBuyer | NewBuyer;

  if ('Membership Number' in rawBuyer) {
    // Existing member
    buyer = {
      membershipNumber: rawBuyer['Membership Number'],
      contactId: normalizeId(rawBuyer['Buyer Contact ID']),
      companyId: normalizeId(rawBuyer[' Buyer Company ID']),
      premiseId: rawBuyer[' Buyer Premise ID'],
      firstName: rawBuyer[' First Name'],
      lastName: rawBuyer['Last Name'],
      region: rawBuyer['Region'],
    };
  } else if (' Address 1' in rawBuyer) {
    // New buyer
    buyer = {
      firstName: rawBuyer['First Name'],
      lastName: rawBuyer[' Last Name'],
      company: rawBuyer[' Company'],
      address1: rawBuyer[' Address 1'],
      address2: rawBuyer[' Address 2'],
      city: rawBuyer[' City'],
      stateKey: rawBuyer[' State Key'],
      state: rawBuyer[' State'],
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
