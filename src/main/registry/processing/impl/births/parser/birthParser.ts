import fs from 'fs/promises';
import Papa from 'papaparse';
import { BrowserWindow, dialog } from 'electron';
import { ParseResult, BirthParseResponse, BirthParseRow } from '@app/api';
import { birthParseMap } from './util/birthParseMap';

/**
 * parses birth data from a given CSV chosen by the user
 * @returns ParseResult of given data
 */
export const birthParser = async (mainWindow: BrowserWindow): Promise<ParseResult<BirthParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: "Select CSV File",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return { 
      data: {
        rows : []
      }, 
      warnings: [] 
    };
  }

  const selectedFile = filePaths[0];
  const fileContent = await fs.readFile(selectedFile, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const warnings: string[] = [];
        const actualHeaders = results.meta.fields ?? [];
        const expectedHeaders = Object.keys(birthParseMap);

        for (const header of expectedHeaders) {
          if (!actualHeaders.includes(header)) {
            warnings.push(`Missing expected column: "${header}"`);
          }
        }

        const parsedData: BirthParseRow[] = (results.data as Record<string, any>[]).map((row) => {
          const parsedRow: Partial<BirthParseRow> = {};

          for (const [csvKey, fieldKey] of Object.entries(birthParseMap)) {
            let value = row[csvKey];

            if (fieldKey === 'isStillborn') {
              value = value?.toLowerCase() === 'true';
            } else if (fieldKey === 'weight') {
              value = value ? parseFloat(value) : 0;
            }

            (parsedRow as Record<keyof BirthParseRow, typeof value>)[fieldKey] = value;
          }

          return parsedRow as BirthParseRow;
        });

        resolve({
          data: {
            rows: parsedData,
          } as BirthParseResponse,
          warnings,
        });
      },
      error: (err: any) => reject(err),
    });
  });
};
