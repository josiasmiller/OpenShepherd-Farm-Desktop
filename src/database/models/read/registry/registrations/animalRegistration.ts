import { BirthInfo } from "../../animal/births/birthInfo";
import { Sex } from "../../animal/general/sex";
import { AnimalIdentification } from "../../animal/identification/animalIdentification";
import { PedigreeNode } from "../../animal/pedigree/pedigree";
import { idTag } from "../../animal/tags/idTag";
import { Owner } from "../../owners/owner";

export type AnimalRegistrationResult = {
  Codon171: string;
  animalIdentification: AnimalIdentification;
  officialTag: idTag | null;
  unofficialTag: idTag;
  sex: Sex;
  FMICRON: string;
  CODON136: string;
  Wgt2nd: string;
  Inbreeding: string;
  pedigree: PedigreeNode;
  breeder: Owner;
  owner: Owner;
  birthInfo: BirthInfo;
}