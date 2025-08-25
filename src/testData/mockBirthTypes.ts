import type { BirthType } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockBirthTypes = new Success<BirthType[]>([
  { id: "live", name: "Live Birth", abbreviation: "LB", display_order: 1 },
  { id: "still", name: "Still Birth", abbreviation: "SB", display_order: 2 },
]);
