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

/**
 * Parses a transfer CSV with multiple sections (animals, seller, buyer)
 */
export const transferParser = async (
  mainWindow: BrowserWindow
): Promise<ParseResult<TransferParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: "Select Transfer CSV File",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return {
      data: { animals: [], seller: null, buyer: null },
      warnings: [],
    };
  }

  const selectedFile = filePaths[0];
  const fileContent = await fs.readFile(selectedFile, "utf-8");

  // Split and normalize lines
  const lines = fileContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const warnings: string[] = [];

  // Helper for case-insensitive header lookup
  const findHeaderIndex = (header: string) =>
    lines.findIndex((l) => l.toUpperCase() === header.toUpperCase());

  // Locate section headers
  const sellerHeaderIndex = findHeaderIndex("SELLER");
  const existingMemberIndex = findHeaderIndex("EXISTING_BUYER");
  const newBuyerIndex = findHeaderIndex("NEW_BUYER");

  if (sellerHeaderIndex === -1) {
    warnings.push("Missing 'SELLER' section header.");
  }

  const buyerSectionStart = existingMemberIndex !== -1 ? existingMemberIndex : newBuyerIndex;
  const buyerIsNew = newBuyerIndex !== -1;

  // ---- SECTION EXTRACTION ----
  // Animals: everything from top until just before SELLER or BUYER
  const animalSection = (() => {
    const end =
      sellerHeaderIndex !== -1
        ? sellerHeaderIndex
        : buyerSectionStart !== -1
        ? buyerSectionStart
        : lines.length;
    // Start from very top
    const section = lines.slice(0, end);
    return section.filter((l) => l.includes(","));
  })();

  const sellerSection = (() => {
    if (sellerHeaderIndex === -1) return [];
    const start = sellerHeaderIndex + 1;
    const end = buyerSectionStart !== -1 ? buyerSectionStart : lines.length;
    return lines.slice(start, end).filter((l) => l.includes(","));
  })();

  const buyerSection = (() => {
    if (buyerSectionStart === -1) return [];
    const start = buyerSectionStart + 1;
    return lines.slice(start).filter((l) => l.includes(","));
  })();

  // ---- PARSING HELPERS ----
  const parseCsvSection = <T>(csvLines: string[]): T[] => {
    if (csvLines.length === 0) return [];
    const csvText = csvLines.join("\n");
    const result = Papa.parse<T>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      newline: "\n",
    });
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((e: { message: any; }) =>
        warnings.push(`Parse error: ${e.message}`)
      );
    }
    return result.data as T[];
  };

  // ---- PARSE EACH SECTION ----
  const animals = parseCsvSection<AnimalRow>(animalSection);
  const sellerData = parseCsvSection<SellerInfo>(sellerSection);
  const seller = sellerData.length > 0 ? sellerData[0] : null;

  let buyer: ExistingMemberBuyer | NewBuyer | null = null;
  if (buyerIsNew) {
    const parsed = parseCsvSection<NewBuyer>(buyerSection);
    if (parsed.length > 0) buyer = parsed[0];
  } else if (existingMemberIndex !== -1) {
    const parsed = parseCsvSection<ExistingMemberBuyer>(buyerSection);
    if (parsed.length > 0) buyer = parsed[0];
  } else {
    warnings.push(
      "Missing buyer section (no 'EXISTING_BUYER' or 'NEW_BUYER' header found)."
    );
  }

  return {
    data: {
      animals,
      seller,
      buyer,
    },
    warnings,
  };
};
