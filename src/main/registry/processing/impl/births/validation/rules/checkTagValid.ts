import { Species, RegistryRow, ValidationResponse } from 'packages/api';

export async function checkTagValid(row: RegistryRow, _: Species): Promise<ValidationResponse> {
  const errors: string[] = [];
  const { fedTypeKey, fedNum, farmTypeKey, farmNum } = row;

  // Hard-coded UUID for electronic tag (TALK WITH TEAM ABOUT HOW TO ABSTRACT THIS)
  const electronicTagUUID = "50f1c64f-e56e-420e-8150-9347fe51c0c1";
  const electronicTagRegex = /^[0-9]{3}_[A-Za-z0-9]{12}$/;

  // Check federal tag if it’s an electronic tag
  if (fedTypeKey === electronicTagUUID) {
    if (!electronicTagRegex.test(fedNum ?? "")) {
      errors.push(
        "fedNum: Electronic tag must have 3 digits, an underscore, then 12 alphanumeric characters."
      );
    }
  }

  // Check farm tag if it’s an electronic tag
  if (farmTypeKey === electronicTagUUID) {
    if (!electronicTagRegex.test(farmNum ?? "")) {
      errors.push(
        "farmNum: Electronic tag must have 3 digits, an underscore, then 12 alphanumeric characters."
      );
    }
  }

  return {
    checkName: "checkValidTags",
    errors,
    passed: errors.length === 0,
  };
}
