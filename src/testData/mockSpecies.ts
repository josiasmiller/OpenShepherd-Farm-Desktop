import type { Species } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockSpecies = new Success<Species[]>([
  { id: '1', common_name: 'Sheep', generic_name: 'Sheep', scientific_name: 'Ovis Aries' },
  { id: '2', common_name: 'Goat',  generic_name: 'Goat',  scientific_name: 'Capra aegagrus hircus' },
]);
