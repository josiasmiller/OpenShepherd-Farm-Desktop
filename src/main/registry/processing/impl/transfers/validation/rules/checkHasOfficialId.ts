import {Database} from "sqlite3";
import { AnimalRow, ValidationResponse } from '@app/api';
import { animalHasActiveOfficialTag } from '../../../../../../database';
import { handleResult } from '@common/core';

/**
 * @param db The Database to act on
 * @param animal animal being checked
 * @returns ValidationResponse indicating if the check passed or failed
 */
export async function checkHasOfficialId(db: Database, animal: AnimalRow): Promise<ValidationResponse> {
  const errors: string[] = [];

  var tagResult = await animalHasActiveOfficialTag(db, animal.animalId);

  await handleResult(tagResult, {
    success: (data: boolean) => {
      if (!data) {
        // animal has no tag
        errors.push(`animal id=${animal.animalId} animalName=${animal.name} has no federal tag`);
      }
    },
    error: (err) => {
      console.error("Failed to fetch if animal has federal tag:", err);
      errors.push(`error when getting animal id=${animal.animalId} animalName=${animal.name} federal tag information: ${err}`);
    },
  });

  return { checkName: "checkHasFederalId", errors, passed: errors.length === 0 };
}
