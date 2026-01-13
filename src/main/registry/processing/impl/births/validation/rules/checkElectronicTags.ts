import { BirthNotification, ValidationResponse } from '@app/api';


export async function checkElectronicTags(bn: BirthNotification): Promise<ValidationResponse> {
  const errors: string[] = [];

  // Hard-coded UUID for electronic tag
  const electronicTagUUID = "50f1c64f-e56e-420e-8150-9347fe51c0c1";
  const electronicTagRegex = /^[0-9]{3}_[A-Za-z0-9]{12}$/;

  if (bn.federalTagType.id === electronicTagUUID) {
    if (!electronicTagRegex.test(bn.fedNum)) {
      errors.push(
        "fedNum: Electronic tag must have 3 digits, an underscore, then 12 alphanumeric characters."
      );
    }
  }

  // Check farm tag if it’s an electronic tag
  if (bn.farmTagType.id === electronicTagUUID) {
    if (!electronicTagRegex.test(bn.farmNum)) {
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
