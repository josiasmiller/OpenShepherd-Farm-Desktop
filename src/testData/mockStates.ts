import type { State } from 'packages/api';
import { Success } from 'packages/core';

export const mockStates = new Success<State[]>([
  { 
    id: "1", 
    name: "Colorado",
    abbreviation: "CO",
    display_order: 1,
    country_id: "1",
  },
  { 
    id: "2", 
    name: "Wisconsin",
    abbreviation: "WI",
    display_order: 2,
    country_id: "1",
  },
]);
