import { BirthType } from '@app/api';

export type InsertAnimalTableInput = {
  name: string;
  sexId: string;
  birthdate: string;
  birthTime?: string;
  birthType: BirthType;
  birthWeight: number | null;
  birthWeightUnitsId: string | null;
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
