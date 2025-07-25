import { BirthType } from "../../../read/animal/births/birthType";

export type InsertAnimalTableInput = {
  name: string;
  sexId: string;
  birthdate: string;
  birthTime?: string;
  birthTypeId: string;
  birthWeight: number;
  birthWeightUnitsId: string;
  birthOrder?: number;
  rearType: BirthType | null;
  weanedDate: string | null;
  deathDate: string | null;
  deathReasonId: string | null;
  sireId: string;
  damId: string;
  fosterDamId?: string;
  surrogateDamId?: string;
  handReared: boolean;
};
