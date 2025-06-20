import { Failure, handleResult, Result, Success } from "../../../../../shared/results/resultTypes.js";
import { getDatabase } from "../../../../dbConnections.js";
import { BirthInfo } from "../../../../models/read/animal/births/birthInfo.js";
import { Sex } from "../../../../models/read/animal/general/sex.js";
import { AnimalIdentification } from "../../../../models/read/animal/identification/animalIdentification.js";
import { PedigreeNode } from "../../../../models/read/animal/pedigree/pedigree.js";
import { Owner } from "../../../../models/read/owners/owner.js";
import { AnimalRegistrationResult } from "../../../../models/read/registry/registrations/animalRegistration.js";
import { getBirthInfo } from "../../animal/births/getBirthInfo.js";
import { getSexFromAnimalId } from "../../animal/general/getSexFromAnimalId.js";
import { getAnimalIdentification } from "../../animal/identification/getAnimalIdentification.js";
import { getPedigree } from "../../animal/pedigree/getPedigree.js";
import { getBreeder } from "../../owners/getBreeder.js";
import { getOwner } from "../../owners/getOwner.js";

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
        breederResult,
        ownerResult,
        animalBirthInfoResult,
        animalSexResult,
      ] = await Promise.all([
        getPedigree(animalId, 4),
        getAnimalIdentification(animalId),
        getBreeder(animalId),
        getOwner(animalId),
        getBirthInfo(animalId),
        getSexFromAnimalId(animalId),
      ]);

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Pedigree
      const pedigreeUnwrap = await unwrapOrFail(pedigreeResult, "pedigree", animalId);
      if (pedigreeUnwrap.tag === "error") {
        return pedigreeUnwrap;
      }
      const pedigree : PedigreeNode = pedigreeUnwrap.data!;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalIdentification
      const idUnwrap = await unwrapOrFail(animalIdentificationResult, "animalIdentification", animalId);
      if (idUnwrap.tag === "error") {
        return idUnwrap;
      }
      const animalIdentification : AnimalIdentification = idUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Breeder
      const breederUnwrap = await unwrapOrFail(breederResult, "breeder", animalId);
      if (breederUnwrap.tag === "error") {
        return breederUnwrap;
      }
      const breeder : Owner = breederUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Owner
      const ownerUnwrap = await unwrapOrFail(ownerResult, "owner", animalId);
      if (ownerUnwrap.tag === "error") {
        return ownerUnwrap;
      }
      const owner : Owner = ownerUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // BirthInfo
      const birthInfoUnwrap = await unwrapOrFail(animalBirthInfoResult, "birthInfo", animalId);
      if (birthInfoUnwrap.tag === "error") {
        return birthInfoUnwrap;
      }
      const birthInfo : BirthInfo = birthInfoUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalSex
      const sexUnwrap = await unwrapOrFail(animalSexResult, "animalSex", animalId);
      if (sexUnwrap.tag === "error") {
        return sexUnwrap;
      }
      const animalSex : Sex = sexUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////

      const registration: AnimalRegistrationResult = {
        UKRegNo: await stubber(animalId),
        FarmID: await stubber(animalId),
        Codon171: await stubber(animalId),
        DESC: await stubber(animalId),
        animalIdentification: animalIdentification,
        sex: animalSex,
        OfficialEarTag: await stubber(animalId),
        FMICRON: "fixme",
        CODON136: "fixme",
        Wgt2nd: "fixme",
        Inbreeding: "fixme",
        pedigree: pedigree!,
        breeder: breeder,
        owner: owner,
        birthInfo: birthInfo,
      };

      results.push(registration);
    }

    return new Success(results);
  } catch (e: any) {
    return new Failure(`Failed to fetch registration info: ${e.message}`);
  }
};