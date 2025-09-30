import { RegistryRow, ValidationResponse } from 'packages/api';
import { isUUIDv4 } from '../../../../helpers/registryHelpers';

export async function checkHasAtLeastOneValidTag(
  row: RegistryRow
): Promise<ValidationResponse> {
  const errors: string[] = [];
  const {
    fedTypeKey,  fedColorKey,  fedLocKey,  fedNum,
    farmTypeKey, farmColorKey, farmLocKey, farmNum,
  } = row;

  // ---------------------------------------------------------------------------------------------
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
  // ---------------------------------------------------------------------------------------------

  const hasValidFedTag = isValidTag(fedTypeKey, fedColorKey, fedLocKey, fedNum);
  const hasValidFarmTag = isValidTag(farmTypeKey, farmColorKey, farmLocKey, farmNum);

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

