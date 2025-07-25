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
  animalIdentification: AnimalIdentification | null;
  officialTag: idTag | null;
  unofficialTag: idTag | null;
  sex: Sex | null;
  FMICRON: string | null;
  secondWeight: number | null;
  Inbreeding: string | null;
  pedigree: PedigreeNode | null;
  breeder: Owner | null;
  owner: Owner | null;
  birthInfo: BirthInfo | null;
}