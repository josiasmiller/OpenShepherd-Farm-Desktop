import fs from 'fs/promises';
import Papa from 'papaparse';
import { RegistrationParseResponse, RegistrationParseRow } from './util/registrationParseRow';
import { registrationParseMap } from './util/registrationParseMap';
import { dialog } from 'electron';
import { ParseResult } from '../../../core/types';

/**
 * parses registration data from a given CSV
 * @returns ParseResult of exported data
 */
export const registrationParser = async (): Promise<ParseResult<RegistrationParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
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
              value = value?.toLowerCase() === 'true';
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
