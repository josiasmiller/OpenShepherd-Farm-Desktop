
export type PedigreeRequest = {
  animalId: string;
}

export type PedigreeNode = {
  animalId: string;
  sirePedigree: PedigreeNode | null;
  damPedigree: PedigreeNode | null;
  registryName: string;
}
          