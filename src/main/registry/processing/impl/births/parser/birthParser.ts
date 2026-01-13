
import { BrowserWindow } from 'electron';
import {
  BirthRecord,
  BirthError,
  PARSE_ERROR,
  ParseError,
  type MissingFieldsError,
  MISSING_FIELDS,
  BirthNotification,
} from '@app/api';
import {selectJsonFile} from "@fileDialogs/jsonSelect";
import {Failure, Result, Success, Fulfillment, cancelled} from "@common/core";
import {readJsonFile} from "@registryHelpers";
import {findBirthMissingFields} from "./helpers/findBirthMissingFields"


/**
 * Main Entrypoint for birth parsing
 */
export const selectAndParseBirths = async (window: BrowserWindow): Promise<Fulfillment<BirthRecord, BirthError>> => {

  const fileResult = await selectJsonFile("Select Births JSON file", window);

  if (fileResult === null) {
    return cancelled();
  }

  return birthParser(fileResult);
}


/**
 * parses birth data from a given CSV chosen by the user
 * @returns ParseResult of given data
 */
export const birthParser = async (filePath: string): Promise<Fulfillment<BirthRecord, BirthError>> => {
  try {
    const fileContents = await readJsonFile(filePath);

    const missingFields: string[] = findBirthMissingFields(fileContents);

    if (missingFields.length > 0) {
      const error: MissingFieldsError = {
        type: MISSING_FIELDS,
        missing: missingFields,
      };

      return new Failure(error);
    }

    // Build BirthRecord rows
    const rows : BirthNotification[] = fileContents.births.map((b: any): BirthRecord["rows"][number] => {

      // Utility: converts { key, value } --> { id, name }
      const toItem = (x: any) => ({
        id: x.key,
        name: x.value,
      });

      const birth: BirthNotification = {
        breeder: toItem(b.breeder),

        isStillborn: b.isStillborn,
        animalName: b.animalName,

        sex: toItem(b.sex),

        birthdate: b.birth.date,
        birthType: toItem(b.birth.type),

        sireId: b.parents.sireId,
        damId: b.parents.damId,

        flockPrefix: toItem(b.prefix),

        // Federal tag fields
        federalTagType: toItem(b.tags.federal.type),
        federalTagColor: toItem(b.tags.federal.color),
        federalTagLocation: toItem(b.tags.federal.location),
        fedNum: b.tags.federal.number,

        // Farm tag fields
        farmTagType: toItem(b.tags.farm.type),
        farmTagColor: toItem(b.tags.farm.color),
        farmTagLocation: toItem(b.tags.farm.location),
        farmNum: b.tags.farm.number,

        weight: b.weight.value,
        weightUnits: toItem(b.weight.units),

        coatColorTableKey: b.coatColor.tableKey,
        coatColor: toItem(b.coatColor),

        serviceType: toItem(b.birth.service),
        birthNotes: b.birth.notes ?? "",
      };

      return birth;
    });

    let ret : BirthRecord = {
      rows: rows,
    }

    return new Success(ret); 
  } catch (err: any) {
    const error: ParseError = {
      type: PARSE_ERROR,
      details: err?.message ?? String(err),
    };
    return new Failure(error);
  }
};
