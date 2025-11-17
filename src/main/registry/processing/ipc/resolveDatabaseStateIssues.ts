import {Database} from "sqlite3";
import { correctLatestRegistrationNumber } from "../../../database/registry/write/correctLatestRegistrationNumber";
import { Result, Success, Failure } from "@common/core";
import { DatabaseStateCheckResponse } from "./handleDatabaseStateCheck";

import { 
  REGISTRATION_CHOCOLATE_WELSH,
  REGISTRATION_REGISTERED,
  REGISTRATION_WHITE_WELSH,
} from "../../../database";

/**
 * Map your registration type IDs here:
 * Adjust these IDs to the actual ones from your system.
 */
const registrationTypeIds = {
  black: REGISTRATION_REGISTERED,
  chocolate: REGISTRATION_CHOCOLATE_WELSH,
  white: REGISTRATION_WHITE_WELSH,
};

/**
 * Given a database state check response,
 * fix any issues by updating last_registration_number accordingly.
 */
export async function resolveDatabaseIssues(
  db: Database,
  stateCheck: DatabaseStateCheckResponse
): Promise<Result<boolean, string>> {
  try {
    // Collect all fix promises
    const fixes: Promise<Result<boolean, string>>[] = [];

    if (!stateCheck.blackVerified) {
      fixes.push(correctLatestRegistrationNumber(db, registrationTypeIds.black));
    }
    if (!stateCheck.chocolateVerified) {
      fixes.push(correctLatestRegistrationNumber(db, registrationTypeIds.chocolate));
    }
    if (!stateCheck.whiteVerified) {
      fixes.push(correctLatestRegistrationNumber(db, registrationTypeIds.white));
    }

    // If nothing to fix
    if (fixes.length === 0) {
      return new Success(true);
    }

    // Await all fixes
    const results = await Promise.all(fixes);

    // Check for any failures
    for (const result of results) {
      if (result instanceof Failure) {
        return result; // early return on first failure
      }
    }

    return new Success(true);
  } catch (err: any) {
    return new Failure(`Failed to resolve database issues: ${err.message}`);
  }
}
