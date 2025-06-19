import { Sex } from "../../animal/general/sex";
import { AnimalIdentification } from "../../animal/identification/animalIdentification";
import { PedigreeNode } from "../../animal/pedigree/pedigree";
import { Owner } from "../../owners/owner";

export type AnimalRegistrationResult = {
  BirthYear: string;
  UKRegNo: string;
  FarmID: string;
  Codon171: string;
  WgtBirth: string;
  DESC: string;
  animalIdentification: AnimalIdentification;
  sex: Sex;
  BirthType: string;
  OfficialEarTag: string;
  FMICRON: string;
  CODON136: string;
  Wgt2nd: string;
  Inbreeding: string;
  pedigree: PedigreeNode;
  BTelNo: string;
  OTelNo: string;
  breeder: Owner;
  // owner: Owner; // TODO --------------> UNCOMMENT WHEN READY
  // OwnerInfo: string;
  // OwnerFlockID: string;
  // OwnerMailingAddress: string;
  // OwnerScrapieID: string;
}