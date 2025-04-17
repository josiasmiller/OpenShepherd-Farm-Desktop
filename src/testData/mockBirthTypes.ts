import type { BirthType } from '../database';

export const mockBirthTypes: BirthType[] = [
  { id: "live", name: "Live Birth", abbreviation: "LB", display_order: 1 },
  { id: "still", name: "Still Birth", abbreviation: "SB", display_order: 2 },
];
