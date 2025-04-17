import type { Location } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockLocations = new Success<Location[]>([
  { 
    id: "1", 
    name: "Right Ear",
    abbreviation: "RE",
    display_order: 1,
  },
  { 
    id: "2", 
    name: "Left Flank",
    abbreviation: "LF",
    display_order: 2,
  },
]);
