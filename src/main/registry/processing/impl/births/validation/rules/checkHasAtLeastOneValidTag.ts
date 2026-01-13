import { BirthNotification, ValidationResponse } from '@app/api';
import { isUUIDv4 } from '@common/core';

export async function checkHasAtLeastOneValidTag(
  row: BirthNotification
): Promise<ValidationResponse> {
  const errors: string[] = [];

  const hasValidFedTag = isValidTag(
    row.federalTagType.id,
    row.federalTagColor.id,
    row.federalTagLocation.id,
    row.fedNum
  );

  const hasValidFarmTag = isValidTag(
    row.farmTagType.id,
    row.farmTagColor.id,
    row.farmTagLocation.id,
    row.farmNum
  );

  // If neither tag is valid, record an error
  if (!hasValidFedTag && !hasValidFarmTag) {
    errors.push("Row must have at least one valid tag (federal or farm).");
  }

  return {
    checkName: "checkHasAtLeastOneValidTag",
    errors,
    passed: errors.length === 0,
  };
}

// helper: check validity of a tag group
const isValidTag = (
  typeKey: string | undefined,
  colorKey: string | undefined,
  locKey: string | undefined,
  num: string | undefined
): boolean => {
  if (!isUUIDv4(typeKey ?? '')) return false;
  if (!isUUIDv4(colorKey ?? '')) return false;
  if (!isUUIDv4(locKey ?? '')) return false;
  if ((num ?? '').trim() === '') return false;
  return true;
};

