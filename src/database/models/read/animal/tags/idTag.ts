import { idColor } from "./idColor";
import { idLocation } from "./idLocation";
import { idType } from "./idType";

export type idTag = {
  id: string;
  isOfficial: boolean;
  animalId: string;
  idNumber: string;
  idType: idType;
  dateOn: Date;
  maleColor: idColor;
  femaleColor: idColor;
  location: idLocation;
};
