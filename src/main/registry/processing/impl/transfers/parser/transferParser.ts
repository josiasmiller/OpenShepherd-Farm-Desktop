import { BrowserWindow } from "electron";
import log from "electron-log";

import {
  AnimalRow,
  SellerInfo,
  ExistingMemberBuyer,
  NewBuyer,
  DIALOG_CANCELLED,
  MISSING_FIELDS,
  NEW_BUYER_NOT_SUPPORTED,
  PARSE_ERROR,
  TransferError,
  TransferRecord,
} from '@app/api';

import type {
  DialogCancelledError,
  MissingFieldsError,
  ParseError,
  NewBuyerNotSupportedError,
} from '@app/api';

import { selectJsonFile } from "@fileDialogs/jsonSelect";
import { readJsonFile } from "@registryHelpers";
import { Failure, Result, Success } from "@common/core";


/**
 * Main Entrypoint for transfer parsing
 */
export const selectAndParseTransfers = async (window: BrowserWindow): Promise<Result<TransferRecord, TransferError>> => {

  const fileResult = await selectJsonFile("Select Transfers JSON file", window);

  if (fileResult === null) {
    const ret: DialogCancelledError = {
      type: DIALOG_CANCELLED,
    };
    return new Failure(ret);
  }

  return transferParser(fileResult);
}


/**
 * Core JSON parser
 */
export const transferParser = async (filePath: string): Promise<Result<TransferRecord, TransferError>> => {
  try {
    const fileContents = await readJsonFile(filePath);

    // Validation without exceptions
    const missingFields: string[] = [];
    if (!fileContents.animals || !Array.isArray(fileContents.animals))
      missingFields.push("animals");
    if (!fileContents.seller || typeof fileContents.seller !== "object")
      missingFields.push("seller");
    if (!fileContents.buyer || typeof fileContents.buyer !== "object")
      missingFields.push("buyer");

    if (missingFields.length > 0) {
      const error: MissingFieldsError = {
        type: MISSING_FIELDS,
        missing: missingFields,
      };

      return new Failure(error);
    }

    // =================================================================================================
    // --- Map ANIMALS ---
    const animals: AnimalRow[] = fileContents.animals.map((a: any) => ({
      animalId: a.animalId ?? "",
      registrationNumber: a.registrationNumber ?? "",
      prefix: a.prefix ?? "",
      name: a.name ?? "",
      birthDate: a.birthDate ?? "",
      birthType: a.birthType ?? "",
      sex: a.sex ?? "",
      coatColor: a.coatColor ?? "",
    }));

    // =================================================================================================
    // --- Map SELLER ---
    const sellerIdentityType = fileContents.seller.identity.type;
    let sellerContactId : string | null = null;
    let sellerCompanyId : string | null = null;

    if (sellerIdentityType === 'contact') {
      sellerContactId = fileContents.seller.identity.id;
    } else if (sellerIdentityType === 'company') {
      sellerCompanyId = fileContents.seller.identity.id;
    } else {
      throw new Error(`Unhandled sellerIdentityType: ${sellerIdentityType}`);
    }

    const seller: SellerInfo = {
      contactId: sellerContactId,
      companyId: sellerCompanyId,
      premiseId: fileContents.seller.premiseId ?? "",
      soldAt: fileContents.seller.soldAt ?? "",
      movedAt: fileContents.seller.movedAt ?? "",
    };

    // =================================================================================================
    // --- Map BUYER ---
    let buyer: ExistingMemberBuyer | NewBuyer | null = null;
    const buyerType = fileContents.buyer.type?.toUpperCase();

    if (buyerType === "EXISTING") {

      const buyerIdentityType = fileContents.buyer.identity.type;
      let buyerContactId : string | null = null;
      let buyerCompanyId : string | null = null;

      if (buyerIdentityType === 'contact') {
        buyerContactId = fileContents.buyer.identity.id;

      } else if (buyerIdentityType === 'company') {
        buyerCompanyId = fileContents.buyer.identity.id;
        
      } else {
        const ret: ParseError = {
          type: PARSE_ERROR,
          details: `Unhandled BuyerIdentityType: ${buyerIdentityType}`,
        };
        return new Failure(ret);
      }

      buyer = {
        membershipNumber: fileContents.buyer.membershipNumber ?? "",
        contactId: buyerContactId,
        companyId: buyerCompanyId,
        premiseId: fileContents.buyer.premiseId ?? "",
        firstName: fileContents.buyer.firstName ?? "",
        lastName: fileContents.buyer.lastName ?? "",
        region: fileContents.buyer.region ?? "",
      } as ExistingMemberBuyer;

    } else if (buyerType === "NEW") {
      const ret: NewBuyerNotSupportedError = {
        type: NEW_BUYER_NOT_SUPPORTED,
      };
      return new Failure(ret);
    } else {
      const ret: ParseError = {
        type: PARSE_ERROR,
        details: `Unhandled BuyerType: ${buyerType}`,
      };
      return new Failure(ret);
    }

    const transferRec : TransferRecord = {
      animals,
      seller,
      buyer,
    } 
    return new Success(transferRec);

  } catch (err: any) {
    log.error("Error parsing transfer JSON:", err);
    const ret: ParseError = {
      type: PARSE_ERROR,
      details: err?.message ?? String(err),
    };
    return new Failure(ret);
  }
};
