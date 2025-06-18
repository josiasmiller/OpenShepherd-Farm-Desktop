import { Failure, handleResult, Result, Success } from "../../../../../shared/results/resultTypes.js";
import { getDatabase } from "../../../../dbConnections.js";
import { AnimalIdentification } from "../../../../models/read/animal/identification/animalIdentification.js";
import { PedigreeNode } from "../../../../models/read/animal/pedigree/pedigree.js";
import { AnimalRegistrationResult } from "../../../../models/read/registry/registrations/animalRegistration.js";
import { getAnimalIdentification } from "../../animal/identification/getAnimalIdentification.js";
import { getPedigree } from "../../animal/pedigree/getPedigree.js";

// STUB FUNCTION -- WILL NOT BE IN FINAL MERGE
const stubber = async (animalId: string): Promise<string> => "fixme";

const unwrapOrFail = async <T>(
  result: Result<T, string>,
  label: string,
  animalId: string
): Promise<Result<T, string>> => {
  if (result.tag === "success") {
    return new Success(result.data);
  } else {
    console.error(`${label} error for animal ID ${animalId}:`, result.error);
    return new Failure(`Failed to get ${label} for animal ID ${animalId}`);
  }
};


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
        animalIdentificationResult,
      ] = await Promise.all([
        getPedigree(animalId, 4),
        getAnimalIdentification(animalId),
      ]);

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Pedigree
      const pedigreeUnwrap = await unwrapOrFail(pedigreeResult, "pedigree", animalId);
      if (pedigreeUnwrap.tag === "error") return pedigreeUnwrap;
      const pedigree = pedigreeUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalIdentification
      const idUnwrap = await unwrapOrFail(animalIdentificationResult, "animalIdentification", animalId);
      if (idUnwrap.tag === "error") return idUnwrap;
      const animalIdentification = idUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Next

      const registration: AnimalRegistrationResult = {
        RegNo: animalId,
        BirthYear: await stubber(animalId),
        UKRegNo: await stubber(animalId),
        FarmID: await stubber(animalId),
        Codon171: await stubber(animalId),
        WgtBirth: await stubber(animalId),
        DESC: await stubber(animalId),
        animalIdentification: animalIdentification,
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