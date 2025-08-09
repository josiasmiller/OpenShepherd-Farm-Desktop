import { RegistryRow, ValidationResponse } from '../../../../core/types';
import { animalHasActiveFederalTag } from '../../../../../../database/index';
import { handleResult } from '../../../../../../shared/results/resultTypes';

/**
 * 
 * @param row verifies that the given animal has any active official ID
 * @returns ValidationResponse indicating if the check passed or failed
 */
export async function checkHasFederalId(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];

  var tagResult = await animalHasActiveFederalTag(row.animalId);

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
