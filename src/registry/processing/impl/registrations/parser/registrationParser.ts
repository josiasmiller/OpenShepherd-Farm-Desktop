import fs from 'fs/promises';
import Papa from 'papaparse';
import { RegistrationParseRow } from './util/registrationParseRow.js';
import { registrationParseMap } from './util/registrationParseMap.js';
import { dialog } from 'electron';

export const registrationParser = async (): Promise<RegistrationParseRow[]> => {

  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Registration CSV File",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

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
        const parsedData: RegistrationParseRow[] = results.data.map((row: Record<string, any>) => {
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

        resolve(parsedData);
      },
      error: (err: Error) => reject(err),
    });
  });
};
