import { RegistryRow, ValidationResponse } from 'packages/api';
import { getAllCountryTagPrefixes } from '../../../../../../database';
import { handleResult } from 'packages/core';
import {Database} from "sqlite3";


export async function checkElectronicTags(db: Database, row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];

  const identificationOneKey : string = row.fedTypeKey;
  const identificationOneTagNumber : string = row.fedNum;
  const identificationTwoKey : string = row.farmTypeKey;
  const identificationTwoTagNumber : string = row.farmNum;

  // Hard-coded UUID for electronic tag
  const electronicTagUUID = "50f1c64f-e56e-420e-8150-9347fe51c0c1";
  const electronicTagRegex = /^[0-9]{3}_[A-Za-z0-9]{12}$/;

  let allCountryTagsResult = await getAllCountryTagPrefixes(db);
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

  if (identificationOneKey === electronicTagUUID) {

    // 1) check that it meets the regex criteria
    if (!electronicTagRegex.test(identificationOneTagNumber)) {
      errors.push(
        "fedNum: Electronic tag must have 3 digits, an underscore, then 12 alphanumeric characters."
      );
    } 

    // NOTE FOR DEVS --> 
    // We currently do not check on birth notifies if the tags the users provide are official or not, so these checks 
    // that are commented out below cannot yet be run until that information is present. 
    // This same concept will apply to farm tags.

    // // 2) if official, then the initial 3 characters should match a country code (if not official, then it should NOT be in there!)
    // const fedCountryTag: string = (fedNum ?? "").substring(0, 3);
    // if (!allCountryTags.includes(fedCountryTag)) {
    //   errors.push(
    //     `fedNum: Invalid country code '${fedCountryTag}'. Must match one of the known country prefixes.`
    //   );
    // }
  }

  // Check farm tag if it’s an electronic tag
  if (identificationTwoKey === electronicTagUUID) {
    if (!electronicTagRegex.test(identificationTwoTagNumber)) {
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
