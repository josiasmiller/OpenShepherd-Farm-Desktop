import fs from 'fs/promises';
import Papa from 'papaparse';
import { BrowserWindow, dialog } from 'electron';
import { ParseResult } from '../../../core/types';
import {
  TransferParseResponse,
  AnimalRow,
  SellerInfo,
  ExistingMemberBuyer,
  NewBuyer,
} from './util/transferParseData';

/**
 * Parses a transfer CSV with multiple sections (animals, seller, buyer)
 */
export const transferParser = async (mainWindow: BrowserWindow): Promise<ParseResult<TransferParseResponse>> => {
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
  const fileContent = await fs.readFile(selectedFile, 'utf-8');

  // Keep raw CSV lines (only filter out empty lines)
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const warnings: string[] = [];

  // Locate section headers
  const sellerHeaderIndex = lines.findIndex(line => line.startsWith("Seller ContactID"));
  const existingMemberIndex = lines.findIndex(line => line.startsWith("Existing Member:"));
  const newBuyerIndex = lines.findIndex(line => line.startsWith("NEW BUYER:"));

  if (sellerHeaderIndex === -1) {
    warnings.push("Missing 'Seller ContactID' section.");
  }

  const buyerSectionStart = existingMemberIndex !== -1 ? existingMemberIndex : newBuyerIndex;
  const buyerIsNew = newBuyerIndex !== -1;

  // Get raw sections
  const animalSection = sellerHeaderIndex !== -1
    ? lines.slice(0, sellerHeaderIndex)
    : [];
  const sellerSection = sellerHeaderIndex !== -1
    ? lines.slice(sellerHeaderIndex, buyerSectionStart !== -1 ? buyerSectionStart : undefined)
    : [];
  const buyerSection = buyerSectionStart !== -1
    ? lines.slice(buyerSectionStart + 1)
    : [];

  // Parse helper
  const parseCsvSection = <T>(csvLines: string[]): T[] => {
    if (csvLines.length === 0) return [];
    const csvText = csvLines.join("\n");
    const result = Papa.parse<T>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
    if (result.errors.length) {
      result.errors.forEach(e => warnings.push(`Parse error: ${e.message}`));
    }
    return result.data;
  };
  // Parse animal rows
  const animals = parseCsvSection<AnimalRow>(animalSection);

  // Parse seller row
  const sellerData = parseCsvSection<SellerInfo>(sellerSection);
  const seller = sellerData.length > 0 ? sellerData[0] : null;

  // Parse buyer
  let buyer: ExistingMemberBuyer | NewBuyer | null = null;
  if (buyerIsNew) {
    const parsed = parseCsvSection<NewBuyer>(buyerSection);
    if (parsed.length > 0) buyer = parsed[0];
  } else if (existingMemberIndex !== -1) {
    const parsed = parseCsvSection<ExistingMemberBuyer>(buyerSection);
    if (parsed.length > 0) buyer = parsed[0];
  } else {
    warnings.push("Missing buyer section (either 'Existing Member:' or 'NEW BUYER:').");
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
