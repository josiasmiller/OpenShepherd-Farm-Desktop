import fs from "fs/promises";
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

// import { selectJsonFile } from "src/main/fileDialogs/jsonSelect";
import { selectJsonFile } from "@main/fileDialogs/jsonSelect";


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
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);

    // Validation without exceptions
    const missingFields: string[] = [];
    if (!parsed.ANIMALS || !Array.isArray(parsed.ANIMALS))
      missingFields.push("ANIMALS");
    if (!parsed.SELLER || typeof parsed.SELLER !== "object")
      missingFields.push("SELLER");
    if (!parsed.BUYER || typeof parsed.BUYER !== "object")
      missingFields.push("BUYER");

    if (missingFields.length > 0) {
      return {
        data: { animals: [], seller: null, buyer: null } as TransferParseResponse,
        warnings: [`Invalid JSON: missing ${missingFields.join(", ")}`],
        errorCode: MISSING_FIELDS,
      } as ParseResult<TransferParseResponse>;
    }

    // --- Map ANIMALS ---
    const animals: AnimalRow[] = parsed.ANIMALS.map((a: any) => ({
      animalId: a.ANIMAL_ID ?? "",
      registrationNumber: a.REGISTRATION_NUMBER ?? "",
      prefix: a.PREFIX ?? "",
      name: a.NAME ?? "",
      birthDate: a.BIRTH_DATE ?? "",
      birthType: a.BIRTH_TYPE ?? "",
      sex: a.SEX ?? "",
      coatColor: a.COAT_COLOR ?? "",
    }));

    // --- Map SELLER ---
    const seller: SellerInfo = {
      contactId: parsed.SELLER.CONTACT_ID ?? "",
      companyId: parsed.SELLER.COMPANY_ID ?? "",
      premiseId: parsed.SELLER.PREMISE_ID ?? "",
      soldAt: parsed.SELLER.SOLD_AT ?? "",
      movedAt: parsed.SELLER.MOVED_AT ?? "",
    };

    // --- Map BUYER ---
    let buyer: ExistingMemberBuyer | NewBuyer | null = null;
    const buyerType = parsed.BUYER.TYPE?.toUpperCase();

    if (buyerType === "EXISTING") {
      buyer = {
        membershipNumber: parsed.BUYER.MEMBERSHIP_NUMBER ?? "",
        contactId: parsed.BUYER.CONTACT_ID ?? "",
        companyId: parsed.BUYER.COMPANY_ID ?? "",
        premiseId: parsed.BUYER.PREMISE_ID ?? "",
        firstName: parsed.BUYER.FIRST_NAME ?? "",
        lastName: parsed.BUYER.LAST_NAME ?? "",
        region: parsed.BUYER.REGION ?? "",
      };
    } else if (buyerType === "NEW") {
      return {
        data: { animals: [], seller: null, buyer: null } as TransferParseResponse,
        warnings: warnings,
        errorCode: NEW_BUYER_NOT_SUPPORTED,
      } as ParseResult<TransferParseResponse>;
    } else {
      warnings.push(`Unknown or missing BUYER.TYPE: ${buyerType}`);
    }

    return {
      data: { animals, seller, buyer },
      warnings,
    };
  } catch (err: any) {
    log.error("Error parsing transfer JSON:", err);
    return {
      data: { animals: [], seller: null, buyer: null } as TransferParseResponse,
      warnings: [`Failed to parse JSON: ${err.message}`],
      errorCode: PARSE_ERROR,
    } as ParseResult<TransferParseResponse>;
  }
};

