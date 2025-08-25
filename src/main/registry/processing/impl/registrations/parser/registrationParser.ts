import fs from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import Papa from 'papaparse';
import { ParseResult } from 'packages/api';
import { RegistrationParseResponse, RegistrationParseRow } from 'packages/api';
import { registrationParseMap } from './util/registrationParseMap';

/**
 * parses registration data from a given CSV
 * @returns ParseResult of exported data
 */
export const registrationParser = async (mainWindow: BrowserWindow): Promise<ParseResult<RegistrationParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog( mainWindow, {
    title: "Select Registration CSV File",
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
        const expectedHeaders = Object.keys(registrationParseMap);

        for (const header of expectedHeaders) {
          if (!actualHeaders.includes(header)) {
            warnings.push(`Missing expected column: "${header}"`);
          }
        }

        const parsedData: RegistrationParseRow[] = (results.data as Record<string, any>[]).map((row) => {
          const parsedRow: Partial<RegistrationParseRow> = {};

          for (const [csvKey, fieldKey] of Object.entries(registrationParseMap)) {
            let value = row[csvKey];

            if (fieldKey === 'isOfficial') {
              value = value?.toLowerCase() === 'true' || value?.toLowerCase() === '1'; // check if field is 'true' or '1'
            }

            (parsedRow as Record<keyof RegistrationParseRow, typeof value>)[fieldKey] = value;
          }

          return parsedRow as RegistrationParseRow;
        });

        resolve({
          data: {
            rows: parsedData,
          }, 
          warnings 
        });
      },
      error: (err : any) => reject(err),
    });
  });
};
