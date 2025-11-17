import {Database} from "sqlite3";
import { RegistryRow, ValidationResponse } from '@app/api';
import { animalHasActiveOfficialTag } from '../../../../../../database';
import { handleResult } from '@common/core';

/**
 * @param db The Database to act on
 * @param row verifies that the given animal has any active official ID
 * @returns ValidationResponse indicating if the check passed or failed
 */
export async function checkHasOfficialId(db: Database, row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];

  var tagResult = await animalHasActiveOfficialTag(db, row.animalId);

  await handleResult(tagResult, {
    success: (data: boolean) => {
      if (!data) {
        // animal has no tag
        errors.push(`animal id=${row.animalId} animalName=${row.name} has no federal tag`);
      }
    },
    error: (err) => {
      console.error("Failed to fetch if animal has federal tag:", err);
      errors.push(`error when getting animal id=${row.animalId} animalName=${row.name} federal tag information: ${err}`);
    },
  });

  return { checkName: "checkHasFederalId", errors, passed: errors.length === 0 };
}
