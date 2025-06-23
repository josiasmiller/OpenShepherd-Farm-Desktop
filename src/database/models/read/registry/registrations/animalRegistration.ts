import { BirthInfo } from "../../animal/births/birthInfo";
import { Sex } from "../../animal/general/sex";
import { CodonResponse } from "../../animal/geneticCharacteristic/codonResponse";
import { AnimalIdentification } from "../../animal/identification/animalIdentification";
import { PedigreeNode } from "../../animal/pedigree/pedigree";
import { idTag } from "../../animal/tags/idTag";
import { Owner } from "../../owners/owner";

export type AnimalRegistrationResult = {
  Codon171: CodonResponse | null;
  Codon136: CodonResponse | null;
  animalIdentification: AnimalIdentification;
  officialTag: idTag | null;
  unofficialTag: idTag | null;
  sex: Sex;
  FMICRON: string;
  Wgt2nd: string;
  Inbreeding: string;
  pedigree: PedigreeNode;
  breeder: Owner;
  owner: Owner;
  birthInfo: BirthInfo;
}