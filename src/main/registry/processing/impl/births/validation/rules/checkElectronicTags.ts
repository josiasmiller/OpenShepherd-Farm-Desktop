import { RegistryRow, ValidationResponse } from 'packages/api';
import { getAllCountryTagPrefixes } from '../../../../../../database';
import { handleResult } from 'packages/core/src';


export async function checkElectronicTags(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];
  const { fedTypeKey, fedNum, farmTypeKey, farmNum } = row;

  // Hard-coded UUID for electronic tag
  const electronicTagUUID = "50f1c64f-e56e-420e-8150-9347fe51c0c1";
  const electronicTagRegex = /^[0-9]{3}_[A-Za-z0-9]{12}$/;

  let allCountryTagsResult = await getAllCountryTagPrefixes();
  let allCountryTags : string[] = [];
  let allCountryTagSuccess : boolean = true;

  await handleResult(allCountryTagsResult, {
    success: (data: string[]) => {
      allCountryTags = data;
    },
    error: (err) => {
      errors.push(`Failed to fetch country tags: ${err}`);
      allCountryTagSuccess = false;
    },
  });

  if (!allCountryTagSuccess) {
    return {
      checkName: "checkElectronicTags",
      errors,
      passed: errors.length === 0,
    };
  }


  // Check federal tag if it’s an electronic tag
  if (fedTypeKey === electronicTagUUID) {
    if (!electronicTagRegex.test(fedNum ?? "")) {
      errors.push(
        "fedNum: Electronic tag must have 3 digits, an underscore, then 12 alphanumeric characters."
      );
    }

    // if it is official, make sure that the first 3 characters line up with an existing country code

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
