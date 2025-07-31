import fs from 'fs/promises';
import Papa from 'papaparse';
import { DeathParseRow } from './util/deathParseRow.js';
import { deathParseMap } from './util/deathParseMap.js';
import { dialog } from 'electron';
import { ParseResult } from '../../../core/types.js';

export const deathParser = async (): Promise<ParseResult<DeathParseRow>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Death CSV File",
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
        const expectedHeaders = Object.keys(deathParseMap);

        for (const header of expectedHeaders) {
          if (!actualHeaders.includes(header)) {
            warnings.push(`Missing expected column: "${header}"`);
          }
        }

        const parsedData: DeathParseRow[] = (results.data as Record<string, any>[]).map((row) => {
          const parsedRow: Partial<DeathParseRow> = {};

          for (const [csvKey, fieldKey] of Object.entries(deathParseMap)) {
            parsedRow[fieldKey as keyof DeathParseRow] = row[csvKey];
          }

          return parsedRow as DeathParseRow;
        });

        resolve({ rows: parsedData, warnings });
      },
      error: (err: any) => reject(err),
    });
  });
};
