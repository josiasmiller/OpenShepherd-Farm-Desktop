import type { BirthType } from 'packages/api';
import { Success } from 'packages/core';

export const mockBirthTypes = new Success<BirthType[]>([
  { id: "live", name: "Live Birth", abbreviation: "LB", display_order: 1 },
  { id: "still", name: "Still Birth", abbreviation: "SB", display_order: 2 },
]);
