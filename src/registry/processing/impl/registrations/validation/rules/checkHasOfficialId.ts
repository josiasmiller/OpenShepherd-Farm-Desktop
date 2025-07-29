import { RegistryRow, ValidationResponse } from '../../../../core/types';
import { Species } from '../../../../../../database/index.js';

export async function checkHasOfficialId(row: RegistryRow, species: Species): Promise<ValidationResponse> {
  const errors: string[] = [];

  // TODO --> implement me

  return { checkName: "checkHasOfficialId", errors, passed: errors.length === 0 };
}
