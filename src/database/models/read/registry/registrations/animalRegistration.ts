import { BirthInfo } from "../../animal/births/birthInfo";
import { Sex } from "../../animal/general/sex";
import { AnimalIdentification } from "../../animal/identification/animalIdentification";
import { PedigreeNode } from "../../animal/pedigree/pedigree";
import { Owner } from "../../owners/owner";

export type AnimalRegistrationResult = {
  UKRegNo: string;
  FarmID: string;
  Codon171: string;
  DESC: string;
  animalIdentification: AnimalIdentification;
  sex: Sex;
  OfficialEarTag: string;
  FMICRON: string;
  CODON136: string;
  Wgt2nd: string;
  Inbreeding: string;
  pedigree: PedigreeNode;
  breeder: Owner;
  owner: Owner;
  birthInfo: BirthInfo;
}