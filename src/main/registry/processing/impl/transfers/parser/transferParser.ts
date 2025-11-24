import { BrowserWindow } from "electron";
import log from "electron-log";

import {
  TransferParseResponse,
  AnimalRow,
  SellerInfo,
  ExistingMemberBuyer,
  NewBuyer,
  ParseResult,
  MISSING_FIELDS,
  PARSE_ERROR,
  NEW_BUYER_NOT_SUPPORTED,
  DIALOG_CANCELLED
} from '@app/api';

import { selectJsonFile } from "@fileDialogs/jsonSelect";
import { readJsonFile } from "@registryHelpers";


/**
 * Main Entrypoint for transfer parsing
 */
export const selectAndParseTransfers = async (window: BrowserWindow): Promise<ParseResult<TransferParseResponse>> => {

  const fileResult = await selectJsonFile("Select Transfers JSON file", window);

  if (fileResult === null) {
    return {
      data: null,
      warnings: [],
      errorCode: DIALOG_CANCELLED,
    } as ParseResult<TransferParseResponse>;
  }

  return transferParser(fileResult);
}


/**
 * Core JSON parser
 */
export const transferParser = async (filePath: string): Promise<ParseResult<TransferParseResponse>> => {

  const warnings: string[] = [];

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
      return {
        data: { animals: [], seller: null, buyer: null },
        warnings: [`Invalid JSON: missing ${missingFields.join(", ")}`],
        errorCode: MISSING_FIELDS,
      } as ParseResult<TransferParseResponse>;
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
    let sellerContactId : string = null;
    let sellerCompanyId : string = null;

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
      let buyerContactId : string = null;
      let buyerCompanyId : string = null;

      if (buyerIdentityType === 'contact') {
        buyerContactId = fileContents.buyer.identity.id;
      } else if (buyerIdentityType === 'company') {
        buyerCompanyId = fileContents.buyer.identity.id;
      } else {
        throw new Error(`Unhandled buyerIdentityType: ${buyerIdentityType}`);
      }

      buyer = {
        membershipNumber: fileContents.buyer.membershipNumber ?? "",
        contactId: buyerContactId,
        companyId: buyerCompanyId,
        premiseId: fileContents.buyer.premiseId ?? "",
        firstName: fileContents.buyer.firstName ?? "",
        lastName: fileContents.buyer.lastName ?? "",
        region: fileContents.buyer.region ?? "",
      };

    } else if (buyerType === "NEW") {
      return {
        data: { animals: [], seller: null, buyer: null },
        warnings: warnings,
        errorCode: NEW_BUYER_NOT_SUPPORTED,
      } as ParseResult<TransferParseResponse>;
    } else {
      warnings.push(`Unknown or missing buyer.type: ${buyerType}`);
    }

    return {
      data: { animals, seller, buyer },
      warnings,
    };
  } catch (err: any) {
    log.error("Error parsing transfer JSON:", err);
    return {
      data: { animals: [], seller: null, buyer: null },
      warnings: [`Failed to parse JSON: ${err.message}`],
      errorCode: PARSE_ERROR,
    } as ParseResult<TransferParseResponse>;
  }
};
