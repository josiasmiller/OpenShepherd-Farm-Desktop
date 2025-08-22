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
  deleteAnimalForSaleEntry,
  getOwnerById,
  insertAnimalGoesToLocation,
  insertTransferOfOwnershipRecord,
  Owner,
  Species,
  TRANSFERRED_BREEDING,
} from '../../../../../database/index';
import { AnimalRow, ExistingMemberBuyer, NewBuyer, SellerInfo, TransferParseResponse } from '../parser/util/transferParseData';

/**
 * processes registration rows by inputing data into the DB. Does not commit anything if any failaures are encountered
 * @param rows RegistryRows to be processed
 * @param _ here only to satisfy interface
 * @returns ProcessingResult indicating if the process was successful or not
 */
export async function processTransferRows(sections: Record<string, RegistryRow[]>, _: Species): Promise<ProcessingResult> {

  let transferResonse : TransferParseResponse = parseTransferSections(sections);

  if (isNewBuyer(transferResonse.buyer)) {
    throw new Error("New Buyers not yet supported");
  }

  // using this until new buyers are implemented
  let buyer : ExistingMemberBuyer = transferResonse.buyer;
  let seller : SellerInfo = transferResonse.seller;

  try {
    await beginTransaction();


    for (const animalInfo of transferResonse.animals) {
      try {

        await insertAnimalGoesToLocation(
          animalInfo.animalId,
          seller.premiseId,
          buyer.premiseId,
          seller.movedAt,
        );

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

        await insertTransferOfOwnershipRecord(
          animalInfo.animalId,
          sellerOwner,
          buyerOwner,
          seller.movedAt,
          TRANSFERRED_BREEDING,
        );

        ///////////////////////////////////////////////////////////////////////////////////////////
        // remove any for sale records from DB for given animal

        await deleteAnimalForSaleEntry(animalInfo.animalId);

        ///////////////////////////////////////////////////////////////////////////////////////////


      } catch (innerError) {
        throw new Error(`Failed processing row with animal name "${animalInfo.name}": ${(innerError as Error).message}`);
      }
    }

    await rollbackTransaction();
    // await commitTransaction(); // TEMP --> not committing to DB while debugging
    return {
      success: true,
      insertedRowCount: transferResonse.animals.length,
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
    contactId: rawSeller['Seller ContactID'],
    companyId: rawSeller['Seller CompanyID'],
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
      contactId: rawBuyer['Buyer Contact ID'],
      companyId: rawBuyer[' Buyer Company ID'],
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

function isNewBuyer(buyer: ExistingMemberBuyer | NewBuyer): buyer is NewBuyer {
  return "address1" in buyer;
}
