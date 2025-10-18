import {Database} from "sqlite3";
import { Failure, handleResult, Result, Success, unwrapOrFailWithAnimal } from "packages/core";
import { BirthInfo, Sex } from 'packages/api'
import { CodonResponse } from "packages/api";
import { AnimalIdentification } from "packages/api";
import { PedigreeNode } from "packages/api";
import { idTag } from "packages/api";
import { Owner, OwnerType, OwnerContact, Company } from "packages/api";
import { AnimalRegistrationResult } from "packages/api";
import { getBirthInfo } from "../../animal/births/getBirthInfo";
import { getSexFromAnimalId } from "../../animal/sex/getSexFromAnimalId";
import { getCodon136ForAnimal } from "../../animal/geneticCharacteristic/getCodon136";
import { getCodon171ForAnimal } from "../../animal/geneticCharacteristic/getCodon171";
import { getAnimalIdentification } from "../../animal/identification/getAnimalIdentification";
import { getPedigree } from "../../animal/pedigree/getPedigree";
import { getMostRecentUnofficialTag } from "../../animal/tags/getRecentFarmTag";
import { getMostRecentOfficialTag } from "../../animal/tags/getRecentOfficialTag";
import { estimateFiftyDayWeight } from "../../animal/weight/estimateFiftyDayWeight";
import { getBreeder } from "../../owners/getBreeder";
import { getOwner } from "../../owners/getOwner";
import { getCompaniesForContact } from "../../owners/getCompaniesForContact";

/**
 * Gets the registration information for all animals in the input array
 *
 * @param db The Database to act on
 * @param animalIds UUID of animal(s) being sought
 * @returns A `Result` containing an array of `AnimalRegistrationResult` objects on success, 
 *          or a string error message on failure.
 */
export const getAnimalRegistrationInfo = async (
  db: Database, animalIds: string[]
): Promise<Result<AnimalRegistrationResult[], string>> => {

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
        fiftyDayWeightResult,
      ] = await Promise.all([
        getPedigree(db, animalId, 4),
        getAnimalIdentification(db, animalId),
        getBreeder(db, animalId),
        getOwner(db, animalId),
        getMostRecentOfficialTag(db, animalId),
        getMostRecentUnofficialTag(db, animalId),
        getBirthInfo(db, animalId),
        getSexFromAnimalId(db, animalId),
        getCodon136ForAnimal(db, animalId),
        getCodon171ForAnimal(db, animalId),
        estimateFiftyDayWeight(db, animalId),
      ]);

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Pedigree
      const pedigreeUnwrap = await unwrapOrFailWithAnimal(pedigreeResult, "pedigree", animalId);

      var pedigree : PedigreeNode | null 

      if (pedigreeUnwrap.tag === "error") {
        pedigree = null;
      } else {
        pedigree = pedigreeUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalIdentification
      const idUnwrap = await unwrapOrFailWithAnimal(animalIdentificationResult, "animalIdentification", animalId);
      
      var animalIdentification : AnimalIdentification | null
      
      if (idUnwrap.tag === "error") {
        animalIdentification = null;
      } else {
        animalIdentification = idUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Breeder
      const breederUnwrap = await unwrapOrFailWithAnimal(breederResult, "breeder", animalId);

      var breeder : Owner | null 

      if (breederUnwrap.tag === "error") {
        breeder = null;
      } else {
        breeder = breederUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Owner
      const ownerUnwrap = await unwrapOrFailWithAnimal(ownerResult, "owner", animalId);
      var owner : Owner | null 

      if (ownerUnwrap.tag === "error") {
        owner = null;
      } else {
        owner = ownerUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Official Tag
      const officialTagUnwrap = await unwrapOrFailWithAnimal(officialTagResult, "officialTag", animalId);

      var officialTag : idTag | null

      if (officialTagUnwrap.tag === "error") {
        officialTag = null;
      } else {
        officialTag = officialTagUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Unofficial Tag
      const unofficialTagUnwrap = await unwrapOrFailWithAnimal(unofficialTagResult, "unofficialTag", animalId);

      var unofficialTag : idTag | null

      if (unofficialTagUnwrap.tag === "error") {
        unofficialTag = null;
      } else {
        unofficialTag = unofficialTagUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // BirthInfo
      const birthInfoUnwrap = await unwrapOrFailWithAnimal(animalBirthInfoResult, "birthInfo", animalId);

      var birthInfo : BirthInfo | null

      if (birthInfoUnwrap.tag === "error") {
        birthInfo = null;
      } else {
        birthInfo = birthInfoUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalSex
      const sexUnwrap = await unwrapOrFailWithAnimal(animalSexResult, "animalSex", animalId);

      var animalSex : Sex | null

      if (sexUnwrap.tag === "error") {
        animalSex = null;
      } else {
        animalSex = sexUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Codon 136
      const codon136Unwrap = await unwrapOrFailWithAnimal(codon136Result, "codon136", animalId);
      
      var codon136 : CodonResponse | null
      
      if (codon136Unwrap.tag === "error") {
        codon136 = null;
      } else {
        codon136 = codon136Unwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Codon 171
      const codon171Unwrap = await unwrapOrFailWithAnimal(codon171Result, "codon171", animalId);

      var codon171 : CodonResponse | null
      
      if (codon171Unwrap.tag === "error") {
        codon171 = null;
      } else {
        codon171 = codon171Unwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // 50 Day Weight
      const fiftyDayWeightUnwrap = await unwrapOrFailWithAnimal(fiftyDayWeightResult, "fiftyDayWeight", animalId);

      var fiftyDayWeight : number | null
      
      if (fiftyDayWeightUnwrap.tag === "error") {
        fiftyDayWeight = null;
      } else {
        fiftyDayWeight = fiftyDayWeightUnwrap.data;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // after getting the previous data, get any companies for a given contact owner

      let ownerCompanies : Company[] = [];

      if (owner.type === OwnerType.CONTACT) {
        const contactOwner = owner as OwnerContact;
        const contactCompanyResult = await getCompaniesForContact(db, contactOwner.contact.id);

        await handleResult(contactCompanyResult, {
          success: (data: Company[]) => {
            ownerCompanies = data;
          },
          error: (err: string) => {
            console.error("Failed to get owner companies: ", err);
            throw new Error(err);
          },
        });
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // after getting the previous data, get any companies for a given contact owner

      let breederCompanies : Company[] = [];

      if (breeder.type === OwnerType.CONTACT) {
        const breederOwner = breeder as OwnerContact;
        const breederCompanyResult = await getCompaniesForContact(db, breederOwner.contact.id);

        await handleResult(breederCompanyResult, {
          success: (data: Company[]) => {
            breederCompanies = data;
          },
          error: (err: string) => {
            console.error("Failed to get owner companies: ", err);
            throw new Error(err);
          },
        });
      }

      const registration: AnimalRegistrationResult = {
        animalIdentification: animalIdentification,
        officialTag: officialTag,
        unofficialTag: unofficialTag,
        sex: animalSex,
        FMICRON: "fixme",
        secondWeight: fiftyDayWeight,
        Inbreeding: "fixme",
        pedigree: pedigree!,
        breeder: breeder,
        owner: owner,
        birthInfo: birthInfo,
        Codon136: codon136,
        Codon171: codon171,
        ownerCompanies: ownerCompanies,
        breederCompanies: breederCompanies,
      };

      results.push(registration);
    }

    return new Success(results);
  } catch (e: any) {
    return new Failure(`Failed to fetch registration info: ${e.message}`);
  }
};