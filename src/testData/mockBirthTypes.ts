import type { BirthType } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockBirthTypes = new Success<BirthType[]>([
  { id: "live", name: "Live Birth", abbreviation: "LB", display_order: 1 },
  { id: "still", name: "Still Birth", abbreviation: "SB", display_order: 2 },
]);
