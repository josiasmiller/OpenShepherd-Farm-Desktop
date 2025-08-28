import type { TagLocation } from 'packages/api';
import { Success } from 'packages/core';

export const mockLocations = new Success<TagLocation[]>([
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
