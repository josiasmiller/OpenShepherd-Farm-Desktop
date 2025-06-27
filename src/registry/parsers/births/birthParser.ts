// src/registry/parsers/births/birthParser.ts

import fs from 'fs/promises';
import Papa from 'papaparse';
import { BirthParseRow } from './util/birthParseRow.js';
import { birthParseMap } from './util/birthParseMap.js';

export const birthParser = async (filepath: string): Promise<BirthParseRow[]> => {
  const fileContent = await fs.readFile(filepath, 'utf-8');

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
