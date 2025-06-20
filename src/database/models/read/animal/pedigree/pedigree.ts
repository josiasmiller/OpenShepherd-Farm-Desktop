
export type PedigreeRequest = {
  animalId: string;
}

export type PedigreeNode = {
  animalId: string;
  sirePedigree: PedigreeNode | null;
  damPedigree: PedigreeNode | null;
  flockPrefix: string | null;
  animalName: string;
  registrationNumber: string | null;
  sexName: string | null;
  birthDate: Date | null;
  birthType: string | null;
}
          