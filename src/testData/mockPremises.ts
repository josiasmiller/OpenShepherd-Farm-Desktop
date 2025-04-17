import type { Premise } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockPremises = new Success<Premise[]>([
  { 
    id: "1", 
    address: "1234 Premise Lane", 
    city: "Denver",
    postcode: "80014",
    country: "USA",
  },
  { 
    id: "2", 
    address: "5678 Premise Drive", 
    city: "Premiseville",
    postcode: "12345",
    country: "USA",
  },
]);
