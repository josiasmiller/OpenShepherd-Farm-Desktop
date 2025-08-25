import { handleResult } from "packages/core";

import { 
  verifyLastRegistrationNumberIsUpToDate,
  REGISTRATION_REGISTERED,
  REGISTRATION_CHOCOLATE_WELSH,
  REGISTRATION_WHITE_WELSH,
} from "../../../database";

export type DatabaseStateCheckResponse = {
  blackVerified     : boolean,
  chocolateVerified : boolean,
  whiteVerified     : boolean,
}

/**
 * 
 * @returns checks the state of hte database to make sure certain data is prepared
 */
export async function handleDatabaseStateCheck(): Promise<DatabaseStateCheckResponse> {
  
  const blackVerified : boolean = await verifyLatestRegistrationValues(REGISTRATION_REGISTERED);
  const chocolateVerified : boolean = await verifyLatestRegistrationValues(REGISTRATION_CHOCOLATE_WELSH);
  const whiteVerified : boolean = await verifyLatestRegistrationValues(REGISTRATION_WHITE_WELSH);

  return {
    blackVerified     : blackVerified,
    chocolateVerified : chocolateVerified,  
    whiteVerified     : whiteVerified,
  };
}

async function verifyLatestRegistrationValues(regType : string): Promise<boolean> {
  const verificationResult = await verifyLastRegistrationNumberIsUpToDate(regType);
  let ret : boolean = false;

  await handleResult(verificationResult, {
    success: (data: boolean) => {
      ret = data;
    },
    error: (err: string) => {
      console.error("Failed to verify registration numbers: ", err);
      throw new Error(err);
    },
  });

  return ret;
}
