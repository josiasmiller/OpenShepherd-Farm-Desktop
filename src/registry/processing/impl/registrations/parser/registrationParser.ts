import fs from 'fs/promises';
import Papa from 'papaparse';
import { RegistrationParseRow } from './util/registrationParseRow.js';
import { registrationParseMap } from './util/registrationParseMap.js';
import { dialog } from 'electron';
import { ParseResult } from '../../../core/types.js';

/**
 * parses registration data from a given CSV
 * @returns parseResult of exported data
 */
export const registrationParser = async (): Promise<ParseResult<RegistrationParseRow>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Registration CSV File",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return { rows: [], warnings: [] };
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

            parsedRow[fieldKey as keyof RegistrationParseRow] = value;
          }

          return parsedRow as RegistrationParseRow;
        });

        resolve({ rows: parsedData, warnings });
      },
      error: (err : any) => reject(err),
    });
  });
};
