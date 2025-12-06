import { ValidationResponse } from '@app/api';
import { isUUIDv4 } from '@common/core';

export function checkUUIDv4(uuid: string): ValidationResponse {
  const errors: string[] = [];

  // If not provided, exit early
  if (uuid === null || uuid === undefined) {
    errors.push(`UUID is missing: ${uuid}`);
    return { checkName: "checkUUIDv4", errors, passed: errors.length === 0 };
  }

  if (!isUUIDv4(uuid)) {
    errors.push(`Invalid UUIDv4 format: expected 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', got '${uuid}'.`);
  }

  return { checkName: "checkUUIDv4", errors, passed: errors.length === 0 };
}
