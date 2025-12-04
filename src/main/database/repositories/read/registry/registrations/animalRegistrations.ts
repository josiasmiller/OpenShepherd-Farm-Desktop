import {Database} from "@database/async";
import { Failure, handleResult, Result, Success, dataOrNull } from "@common/core";
import {BirthInfo, RegistryCertificate, Sex} from '@app/api'
import { CodonResponse } from '@app/api';
import { AnimalIdentification } from '@app/api';
import { PedigreeNode } from '@app/api';
import { idTag } from '@app/api';
import { Owner, OwnerType, OwnerContact, Company } from '@app/api';
import { AnimalRegistrationResult } from '@app/api';
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
import { getRegistryCertificatesForAnimal } from "./getRegistryCertificatesForAnimal";
import log from "electron-log";

/**
 * Gets the registration information for all animals in the input array
 *
 * @param db The Database to act on
 * @param animalIds UUID of animal(s) being sought
 * @param registryCompanyId which registry company to use to get the latest unprinted certificate Id
 * @returns A `Result` containing an array of `AnimalRegistrationResult` objects on success,
 *          or a string error message on failure.
 */
export const getAnimalRegistrationInfo = async (
  db: Database,
  animalIds: string[],
  registryCompanyId: string, 
): Promise<Result<AnimalRegistrationResult[], string>> => {

  try {
    const results: AnimalRegistrationResult[] = [];

    for (const animalId of animalIds) {

      const [
        unprintedCertificateResult,
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
        getRegistryCertificatesForAnimal(db, registryCompanyId, animalId),

        // this will need to be updated to use our DB wrapper
        getPedigree(db.raw(), animalId, 4),
        getAnimalIdentification(db.raw(), animalId),
        getBreeder(db.raw(), animalId),
        getOwner(db.raw(), animalId),
        getMostRecentOfficialTag(db.raw(), animalId),
        getMostRecentUnofficialTag(db.raw(), animalId),
        getBirthInfo(db.raw(), animalId),
        getSexFromAnimalId(db.raw(), animalId),
        getCodon136ForAnimal(db.raw(), animalId),
        getCodon171ForAnimal(db.raw(), animalId),
        estimateFiftyDayWeight(db.raw(), animalId),
      ]);

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // AnimalIdentification
      let animalIdentification : AnimalIdentification | null = dataOrNull(animalIdentificationResult)

      // we always want some form of identification for the animals
      if (animalIdentification === null) {
        const errMsg = `No identification found for animalId=\'${animalId}\'`
        log.error(errMsg)
        return new Failure(errMsg);
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // unprinted certificate ID checker

      let foundUnprintedPaper : boolean = false;
      // let unprintedPaperUUID : string = null;
      let unprintedCertificates : RegistryCertificate[] = []

      await handleResult(unprintedCertificateResult, {
        success: (certs: RegistryCertificate[]) => {
          
          if (certs !== undefined && certs.length > 0) {
            foundUnprintedPaper = true;
            unprintedCertificates = certs;
          }
        },
        error: (err: string) => {
          log.error(`Error when finding certificate for animalId=\'${animalId}\':`, err);
          throw new Error(err);
        },
      });

      // when no unprinted paper is found or we do not find a UUID for said paper, do not do any processing
      if (!foundUnprintedPaper || unprintedCertificates.length === 0) {
        log.info(`No certificate papers for for name=\'${animalIdentification.name}\' animalId=\'${animalId}\'`)
        continue;
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////
      // Extract rest of information from results
      let pedigree : PedigreeNode | null = dataOrNull(pedigreeResult);

      let breeder : Owner | null = dataOrNull(breederResult);

      let owner : Owner | null = dataOrNull(ownerResult);

      let officialTag : idTag | null = dataOrNull(officialTagResult);

      let unofficialTag : idTag | null = dataOrNull(unofficialTagResult);

      let birthInfo : BirthInfo | null = dataOrNull(animalBirthInfoResult);

      let animalSex : Sex | null = dataOrNull(animalSexResult);

      let codon136 : CodonResponse | null = dataOrNull(codon136Result);

      let codon171 : CodonResponse | null = dataOrNull(codon171Result);

      let fiftyDayWeight : number | null = dataOrNull(fiftyDayWeightResult);

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
            log.error("Failed to get owner companies: ", err);
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
            log.error("Failed to get owner companies: ", err);
            throw new Error(err);
          },
        });
      }

      const registration: AnimalRegistrationResult = {
        unprintedCertificates: unprintedCertificates,
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

