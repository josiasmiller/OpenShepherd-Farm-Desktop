import {
  MISSING_FIELDS,
  type MissingFieldsError, PARSE_ERROR, type ParseError
} from '@app/api';

import { BrowserWindow } from 'electron';
import {selectJsonFile} from "@fileDialogs/jsonSelect";
import {AnimalDeath, DeathRecord} from "@app/api";
import {DialogOutcome, Failure, Success, cancelled} from "@common/core";
import {DeathError} from "@app/api";
import {readJsonFile} from "@registryHelpers";
import log from "electron-log";

/**
 * Main Entrypoint for death parsing
 */
export const selectAndParseDeaths = async (window: BrowserWindow): Promise<DialogOutcome<DeathRecord, DeathError>> => {

  const fileResult = await selectJsonFile("Select Deaths JSON file", window);

  if (fileResult === null) {
    return cancelled();
  }

  return deathParser(fileResult);
}


export const deathParser = async (filePath: string): Promise<DialogOutcome<DeathRecord, DeathError>> => {

  try{
    const fileContents = await readJsonFile(filePath);

    if (!fileContents.deaths || !Array.isArray(fileContents.deaths)) {
      const error: MissingFieldsError = {
        type: MISSING_FIELDS,
        missing: ["deaths"],
      };

      return new Failure(error);
    }


    // ===================================================================================================================
    // --- Map deaths ---
    const animalDeaths: AnimalDeath[] = fileContents.deaths.map((a: any) => ({
      deathDate: a.deathDate ?? "",
      animalId: a.animalId ?? "",
      registrationNumber: a.registrationNumber ?? "",
      prefixKey: a.prefixKey ?? "",
      prefix: a.prefix ?? "",
      name: a.name ?? "",
      reasonKey: a.reasonKey ?? "",
      reason: a.reason ?? "",
      notes: a.notes ?? "",
    }));

    const deathRecord : DeathRecord = {
      deaths: animalDeaths
    }

    return new Success(deathRecord);

  } catch (err: any) {
    log.error("Error parsing json JSON:", err);
    const ret: ParseError = {
      type: PARSE_ERROR,
      details: err?.message ?? String(err),
    };
    return new Failure(ret);
  }
};