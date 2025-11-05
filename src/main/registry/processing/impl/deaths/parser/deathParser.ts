import fs from 'fs/promises';
import { DeathParseResponse, DeathParseRow, ParseResult } from 'packages/api';
import { BrowserWindow, dialog } from 'electron';

export const deathParser = async (
  mainWindow: BrowserWindow
): Promise<ParseResult<DeathParseResponse>> => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Death JSON File',
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (canceled || filePaths.length === 0) {
    console.log('User cancelled JSON file selection.');
    return {
      data: { rows: [] },
      warnings: [],
    };
  }

  const selectedFile = filePaths[0];
  const fileContent = await fs.readFile(selectedFile, 'utf-8');

  try {
    const parsed = JSON.parse(fileContent);

    if (!parsed.deaths || !Array.isArray(parsed.deaths)) {
      throw new Error('Invalid JSON format: missing "deaths" array');
    }

    const rows: DeathParseRow[] = parsed.deaths.map((death: any) => ({
      deathDate: death.DEATH_DATE ?? '',
      animalId: death.ID_ANIMALID ?? '',
      prefixKey: death.PREFIX_KEY ?? '',
      prefix: death.PREFIX ?? '',
      name: death.NAME ?? '',
      registrationNumber: death.REGISTRATION_NUMBER ?? '',
      reasonKey: death.REASON_KEY ?? '',
      reason: death.REASON ?? '',
      notes: death.NOTES ?? '',
    }));

    const result: ParseResult<DeathParseResponse> = {
      data: { rows },
      warnings: [],
    };

    return result;
  } catch (error: any) {
    console.error('Failed to parse JSON:', error);
    return {
      data: { rows: [] },
      warnings: [`Failed to parse JSON: ${error.message}`],
    };
  }
};
