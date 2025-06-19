import { Sex } from "../../animal/general/sex";
import { AnimalIdentification } from "../../animal/identification/animalIdentification";
import { PedigreeNode } from "../../animal/pedigree/pedigree";

export type AnimalRegistrationResult = {
  RegNo: string;
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
  PrintDate: string;
  BreederInfo: string;
  BreederFlockID: string;
  BreederMailingAddress: string;
  BreederScrapieID: string;
  OwnerInfo: string;
  OwnerFlockID: string;
  OwnerMailingAddress: string;
  OwnerScrapieID: string;
}