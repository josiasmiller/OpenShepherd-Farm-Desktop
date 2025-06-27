// src/registry/parsers/births/birthParser.ts

import fs from 'fs/promises';
import Papa from 'papaparse';
import { BirthParseRow } from './util/birthParseRow.js';
import { birthParseMap } from './util/birthParseMap.js';
import { dialog } from 'electron';

export const birthParser = async (): Promise<BirthParseRow[]> => {
  // Show the file selection dialog (CSV only)
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select CSV File",
    properties: ["openFile"],
    filters: [
      { name: "CSV Files", extensions: ["csv"] }
    ],
  });

  // Handle user cancellation
  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return [];
  }

  const selectedFile = filePaths[0];

  const fileContent = await fs.readFile(selectedFile, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const parsedData: BirthParseRow[] = results.data.map((row: Record<string, any>) => {

          const parsedRow: Partial<BirthParseRow> = {};

          for (const [csvKey, fieldKey] of Object.entries(birthParseMap)) {
            let value = row[csvKey];

            if (fieldKey === 'isStillborn') {
              value = value?.toLowerCase() === 'true';
            } else if (fieldKey === 'weight') {
              value = value ? parseFloat(value) : 0;
            }

            parsedRow[fieldKey as keyof BirthParseRow] = value;
          }

          return parsedRow as BirthParseRow;
        });

        resolve(parsedData);
      },
      error: (err: Error) => reject(err),
    });
  });
};
