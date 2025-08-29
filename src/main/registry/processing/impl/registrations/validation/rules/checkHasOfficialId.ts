import { handleResult } from 'packages/core';
import { RegistryRow, ValidationResponse } from 'packages/api';
import { animalHasActiveOfficialTag } from '../../../../../../database';

/**
 * 
 * @param row verifies that the given animal has any active official ID
 * @returns ValidationResponse indicating if the check passed or failed
 */
export async function checkHasOfficialId(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];

  // if the user provides a federal tag in the uploaded data, we need not perform a check on the DB
  if (isFedTagProvidedInRow(row)) {
    return { checkName: "checkHasOfficialId", errors, passed: errors.length === 0 };
  }

  var tagResult = await animalHasActiveOfficialTag(row.animalId);

  await handleResult(tagResult, {
    success: (data: boolean) => {
      if (!data) {
        // animal has no tag
        errors.push(`animal id=${row.animalId} animalName=${row.animalName} has no official tag`);
      }
    },
    error: (err) => {
      console.error("Failed to fetch if animal has official tag:", err);
      errors.push(`error when getting animal id=${row.animalId} animalName=${row.animalName} official tag information: ${err}`);
    },
  });

  return { checkName: "checkHasOfficialId", errors, passed: errors.length === 0 };
}

function isFedTagProvidedInRow(row: RegistryRow): boolean {
  const fedIsOfficial  : boolean = row.isOfficial

  if (!fedIsOfficial) {
    return false;
  }

  const fedTypeKey      : string = row.fedTypeKey;
  const fedType        : string = row.fedType;
  const fedColorKey    : string = row.fedColorKey;
  // const fedColor       : string = row.fedColor; // keeping here in case it is needed in the future
  const fedLocationKey : string = row.fedLocKey;
  // const fedLocation    : string = row.fedLoc;
  const fedNumber      : string = row.fedNum;

  if (!fedTypeKey || !fedType || !fedColorKey || !fedLocationKey || !fedNumber) {
    return false;
  }

  return true;
}