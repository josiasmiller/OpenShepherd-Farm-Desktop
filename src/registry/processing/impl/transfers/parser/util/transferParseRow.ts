
export type TransferParseResponse = {
  rows: TransferParseRow[];
  seller: string; //fixme --> will need to implement a type for seller
}

export type TransferParseRow = {
  breederId: string;
  breederName: string;
  animalId: string;
  registrationNumber: string;
  animalPrefix: string;
  animalName: string;
  birthdate: string;
  sex: string;
  birthType: string;
  isOfficial: boolean;
  fedTypeKey: string;
  fedType: string;
  fedColorKey: string;
  fedColor: string;
  fedLocKey: string;
  fedLoc: string;
  fedNum: string;
  farmTypeKey: string;
  farmType: string;
  farmColorKey: string;
  farmColor: string;
  farmLocKey: string;
  farmLoc: string;
  farmNum: string;
  coatColorKey: string;
  coatColor: string;
};
