import type { Premise } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockPremises = new Success<Premise[]>([
  { 
    id: "1", 
    address: "1234 Premise Lane", 
    city: "Denver",
    postcode: "80014",
    country: "USA",
    state: {
      id: '1',
      name: 'USA',
      abbreviation: 'US',
      display_order: 1,
      country_id: '1'
    }
  },
  { 
    id: "2", 
    address: "5678 Premise Drive", 
    city: "Premiseville",
    postcode: "12345",
    country: "USA",
    state: {
      id: '2',
      name: 'United Kingdom',
      abbreviation: 'UK',
      display_order: 2,
      country_id: '2'
    },
  },
]);
