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
  Sex: string;
  BirthType: string;
  OfficialEarTag: string;
  FMICRON: string;
  CODON136: string;
  Wgt2nd: string;
  Inbreeding: string;
  pedigree: PedigreeNode;
  BreederMailingAddress: string;
  BTelNo: string;
  BreederScrapieID: string;
  OwnerMailingAddress: string;
  OTelNo: string;
  OwnerScrapieID: string;
  PrintDate: string;
  BreederFlockID: string;
  OwnerFlockID: string;
  BreederInfo: string;
  OwnerInfo: string;
}