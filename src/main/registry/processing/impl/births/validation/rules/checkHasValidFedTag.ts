import { RegistryRow, ValidationResponse } from 'packages/api';
import { isUUIDv4 } from '../../../../helpers/registryHelpers';

export async function checkHasValidFedTag(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];
  const { fedTypeKey, fedColorKey, fedLocKey, fedNum } = row;

  // verify that at all federal tag information is valid
  if (!isUUIDv4(fedTypeKey)) {
    errors.push(`Federal Type Key: \'${fedTypeKey}\' is not a valid UUIDv4`);
  }

  if (!isUUIDv4(fedColorKey)) {
    errors.push(`Federal Color Key: \'${fedColorKey}\' is not a valid UUIDv4`);
  }

  if (!isUUIDv4(fedLocKey)) {
    errors.push(`Federal Location Key: \'${fedLocKey}\' is not a valid UUIDv4`);
  }

  return {
    checkName: "checkHasValidFedTag",
    errors,
    passed: errors.length === 0,
  };
}
