import fs from 'fs/promises';
import Papa from 'papaparse';
import { TransferParseResponse, TransferParseRow } from './util/transferParseRow';
import { transferParseMap } from './util/transferParseMap';
import { dialog } from 'electron';
import { ParseResult } from '../../../core/types';

/**
 * parses registration data from a given CSV
 * @returns parseResponse of exported data
 */
export const transferParser = async (): Promise<ParseResult<TransferParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Registration CSV File",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return {
      data: {
        rows: [],
        seller: 'fixme',
      }, 
      warnings: [], 
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
        const expectedHeaders = Object.keys(transferParseMap);

        for (const header of expectedHeaders) {
          if (!actualHeaders.includes(header)) {
            warnings.push(`Missing expected column: "${header}"`);
          }
        }

        const parsedData: TransferParseRow[] = (results.data as Record<string, any>[]).map((row) => {
          const parsedRow: Partial<TransferParseRow> = {};

          for (const [csvKey, fieldKey] of Object.entries(transferParseMap)) {
            let value = row[csvKey];

            if (fieldKey === 'isOfficial') {
              value = value?.toLowerCase() === 'true';
            }

            (parsedRow as Record<keyof TransferParseRow, typeof value>)[fieldKey] = value;
          }

          return parsedRow as TransferParseRow;
        });

        resolve({
          data: {
            rows: parsedData,
            seller: 'fixme',
          }, 
          warnings 
        });
      },
      error: (err : any) => reject(err),
    });
  });
};
