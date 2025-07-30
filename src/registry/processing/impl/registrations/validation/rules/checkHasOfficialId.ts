import { RegistryRow, ValidationResponse } from '../../../../core/types';
import { animalHasActiveOfficialTag } from '../../../../../../database/index.js';
import { handleResult } from '../../../../../../shared/results/resultTypes.js';

/**
 * 
 * @param row verifies that the given animal has any active official ID
 * @returns ValidationResponse indicating if the check passed or failed
 */
export async function checkHasOfficialId(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];

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
