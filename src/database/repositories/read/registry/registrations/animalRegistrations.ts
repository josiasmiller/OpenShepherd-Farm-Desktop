import { Failure, handleResult, Result, Success } from "../../../../../shared/results/resultTypes.js";
import { getDatabase } from "../../../../dbConnections.js";
import { PedigreeNode } from "../../../../models/read/animal/pedigree/pedigree.js";
import { AnimalRegistrationResult } from "../../../../models/read/registry/registrations/animalRegistration.js";
import { getPedigree } from "../../animal/pedigree/getPedigree.js";

// STUB FUNCTION -- WILL NOT BE IN FINAL MERGE
const stubber = async (animalId: string): Promise<string> => "fixme";

export const getAnimalRegistrationInfo = async (
  animalIds: string[]
): Promise<Result<AnimalRegistrationResult[], string>> => {
  const db = getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  try {
    const results: AnimalRegistrationResult[] = [];

    for (const animalId of animalIds) {

      const [
        pedigreeResult,
      ] = await Promise.all([
        getPedigree(animalId, 4),
      ]);

      const pedigree: PedigreeNode | null = await handleResult(pedigreeResult, {
        success: async (data) => data,
        error: async (err) => {
          console.error("Pedigree error:", err);
          return null;
        },
      });

      if (pedigree === null) {
        return new Failure(`Failed to get pedigree for animal ID: ${animalId}`);
      }

      const registration: AnimalRegistrationResult = {
        RegNo: animalId,
        BirthYear: await stubber(animalId),
        UKRegNo: await stubber(animalId),
        FarmID: await stubber(animalId),
        Codon171: await stubber(animalId),
        WgtBirth: await stubber(animalId),
        DESC: await stubber(animalId),
        Name: await stubber(animalId),
        Sex: await stubber(animalId),
        BirthType: await stubber(animalId),
        OfficialEarTag: await stubber(animalId),
        FMICRON: "fixme",
        CODON136: "fixme",
        Wgt2nd: "fixme",
        Inbreeding: "fixme",
        pedigree: pedigree!,
        BreederMailingAddress: "fixme",
        BTelNo: "fixme",
        BreederScrapieID: "fixme",
        OwnerMailingAddress: "fixme",
        OTelNo: "fixme",
        OwnerScrapieID: "fixme",
        PrintDate: "fixme",
        ssSpecial: "fixme",
        sdsdSpecial: "fixme",
        BreederFlockID: "fixme",
        OwnerFlockID: "fixme",
        BreederInfo: "fixme",
        OwnerInfo: "fixme",
      };

      results.push(registration);
    }

    return new Success(results);
  } catch (e: any) {
    return new Failure(`Failed to fetch registration info: ${e.message}`);
  }
};