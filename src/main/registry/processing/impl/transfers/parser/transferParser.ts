import fs from 'fs/promises';
import Papa from 'papaparse';
import { BrowserWindow, dialog } from 'electron';
import { ParseResult } from '@app/api';

import {
  TransferParseResponse,
  AnimalRow,
  SellerInfo,
  ExistingMemberBuyer,
  NewBuyer,
} from '@app/api';

export const transferParser = async (
  mainWindow: BrowserWindow
): Promise<ParseResult<TransferParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: "Select Transfer JSON File",
    properties: ["openFile"],
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log("User cancelled JSON file selection.");
    return {
      data: { animals: [], seller: null, buyer: null },
      warnings: [],
    };
  }

  const selectedFile = filePaths[0];
  const fileContent = await fs.readFile(selectedFile, "utf-8");

  const warnings: string[] = [];

  try {
    const parsed = JSON.parse(fileContent);

    // --- Validate JSON structure ---
    if (!parsed.ANIMALS || !Array.isArray(parsed.ANIMALS)) {
      throw new Error('Invalid JSON format: missing "ANIMALS" array');
    }
    if (!parsed.SELLER || typeof parsed.SELLER !== "object") {
      throw new Error('Invalid JSON format: missing "SELLER" object');
    }
    if (!parsed.BUYER || typeof parsed.BUYER !== "object") {
      throw new Error('Invalid JSON format: missing "BUYER" object');
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
      // Assuming `NewBuyer` has similar but possibly different fields
      buyer = {
        membershipNumber: parsed.BUYER.MEMBERSHIP_NUMBER ?? "",
        contactId: parsed.BUYER.CONTACT_ID ?? "",
        companyId: parsed.BUYER.COMPANY_ID ?? "",
        premiseId: parsed.BUYER.PREMISE_ID ?? "",
        firstName: parsed.BUYER.FIRST_NAME ?? "",
        lastName: parsed.BUYER.LAST_NAME ?? "",
        region: parsed.BUYER.REGION ?? "",
      };
    } else {
      warnings.push(`Unknown or missing BUYER.TYPE: ${buyerType}`);
    }

    const result: ParseResult<TransferParseResponse> = {
      data: {
        animals,
        seller,
        buyer,
      },
      warnings,
    };

    return result;
  } catch (error: any) {
    console.error("Failed to parse JSON:", error);
    return {
      data: { animals: [], seller: null, buyer: null },
      warnings: [`Failed to parse JSON: ${error.message}`],
    };
  }
};
