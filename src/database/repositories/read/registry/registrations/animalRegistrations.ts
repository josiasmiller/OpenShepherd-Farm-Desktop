import { Failure, Result, Success, unwrapOrFailWithAnimal } from "../../../../../shared/results/resultTypes.js";
import { getDatabase } from "../../../../dbConnections.js";
import { BirthInfo } from "../../../../models/read/animal/births/birthInfo.js";
import { Sex } from "../../../../models/read/animal/general/sex.js";
import { CodonResponse } from "../../../../models/read/animal/geneticCharacteristic/codonResponse.js";
import { AnimalIdentification } from "../../../../models/read/animal/identification/animalIdentification.js";
import { PedigreeNode } from "../../../../models/read/animal/pedigree/pedigree.js";
import { idTag } from "../../../../models/read/animal/tags/idTag.js";
import { Owner } from "../../../../models/read/owners/owner.js";
import { AnimalRegistrationResult } from "../../../../models/read/registry/registrations/animalRegistration.js";
import { getBirthInfo } from "../../animal/births/getBirthInfo.js";
import { getSexFromAnimalId } from "../../animal/general/getSexFromAnimalId.js";
import { getCodon136ForAnimal } from "../../animal/geneticCharacteristic/getCodon136.js";
import { getCodon171ForAnimal } from "../../animal/geneticCharacteristic/getCodon171.js";
import { getAnimalIdentification } from "../../animal/identification/getAnimalIdentification.js";
import { getPedigree } from "../../animal/pedigree/getPedigree.js";
import { getMostRecentUnofficialTag } from "../../animal/tags/getRecentFarmTag.js";
import { getMostRecentOfficialTag } from "../../animal/tags/getRecentOfficialTag.js";
import { getBreeder } from "../../owners/getBreeder.js";
import { getOwner } from "../../owners/getOwner.js";


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
        officialTagResult,
        unofficialTagResult,
        animalBirthInfoResult,
        animalSexResult,
        codon136Result,
        codon171Result,
      ] = await Promise.all([
        getPedigree(animalId, 4),
        getAnimalIdentification(animalId),
        getBreeder(animalId),
        getOwner(animalId),
        getMostRecentOfficialTag(animalId),
        getMostRecentUnofficialTag(animalId),
        getBirthInfo(animalId),
        getSexFromAnimalId(animalId),
        getCodon136ForAnimal(animalId),
        getCodon171ForAnimal(animalId),
      ]);

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Pedigree
      const pedigreeUnwrap = await unwrapOrFailWithAnimal(pedigreeResult, "pedigree", animalId);
      if (pedigreeUnwrap.tag === "error") {
        return pedigreeUnwrap;
      }
      const pedigree : PedigreeNode = pedigreeUnwrap.data!;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalIdentification
      const idUnwrap = await unwrapOrFailWithAnimal(animalIdentificationResult, "animalIdentification", animalId);
      if (idUnwrap.tag === "error") {
        return idUnwrap;
      }
      const animalIdentification : AnimalIdentification = idUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Breeder
      const breederUnwrap = await unwrapOrFailWithAnimal(breederResult, "breeder", animalId);
      if (breederUnwrap.tag === "error") {
        return breederUnwrap;
      }
      const breeder : Owner = breederUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Owner
      const ownerUnwrap = await unwrapOrFailWithAnimal(ownerResult, "owner", animalId);
      if (ownerUnwrap.tag === "error") {
        return ownerUnwrap;
      }
      const owner : Owner = ownerUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Official Tag
      const officialTagUnwrap = await unwrapOrFailWithAnimal(officialTagResult, "officialTag", animalId);
      if (officialTagUnwrap.tag === "error") {
        return officialTagUnwrap;
      }
      const officialTag : idTag | null = officialTagUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Unofficial Tag
      const unofficialTagUnwrap = await unwrapOrFailWithAnimal(unofficialTagResult, "unofficialTag", animalId);
      if (unofficialTagUnwrap.tag === "error") {
        return unofficialTagUnwrap;
      }
      const unofficialTag : idTag = unofficialTagUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // BirthInfo
      const birthInfoUnwrap = await unwrapOrFailWithAnimal(animalBirthInfoResult, "birthInfo", animalId);
      if (birthInfoUnwrap.tag === "error") {
        return birthInfoUnwrap;
      }
      const birthInfo : BirthInfo = birthInfoUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalSex
      const sexUnwrap = await unwrapOrFailWithAnimal(animalSexResult, "animalSex", animalId);
      if (sexUnwrap.tag === "error") {
        return sexUnwrap;
      }
      const animalSex : Sex = sexUnwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Codon 136
      const codon136Unwrap = await unwrapOrFailWithAnimal(codon136Result, "codon136", animalId);
      if (codon136Unwrap.tag === "error") {
        return codon136Unwrap;
      }
      const codon136 : CodonResponse | null = codon136Unwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Codon 171
      const codon171Unwrap = await unwrapOrFailWithAnimal(codon171Result, "codon171", animalId);
      if (codon171Unwrap.tag === "error") {
        return codon171Unwrap;
      }
      const codon171 : CodonResponse | null = codon171Unwrap.data;

      /////////////////////////////////////////////////////////////////////////////////////////////////

      const registration: AnimalRegistrationResult = {
        animalIdentification: animalIdentification,
        officialTag: officialTag,
        unofficialTag: unofficialTag,
        sex: animalSex,
        FMICRON: "fixme",
        Wgt2nd: "fixme",
        Inbreeding: "fixme",
        pedigree: pedigree!,
        breeder: breeder,
        owner: owner,
        birthInfo: birthInfo,
        Codon136: codon136,
        Codon171: codon171,
      };

      results.push(registration);
    }

    return new Success(results);
  } catch (e: any) {
    return new Failure(`Failed to fetch registration info: ${e.message}`);
  }
};