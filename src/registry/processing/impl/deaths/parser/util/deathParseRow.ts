

export type DeathParseResponse = {
  rows: DeathParseRow[];
}

export type DeathParseRow = {
  deathDate: string;
  animalId: string;
  prefixKey: string;
  prefix: string;
  name: string;
  registrationNumber: string;
  reasonKey: string;
  reason: string;
  notes: string;
};
