import type { Species } from '@app/api';
import { Success } from '@common/core';

export const mockSpecies = new Success<Species[]>([
  { id: '1', common_name: 'Sheep', generic_name: 'Sheep', scientific_name: 'Ovis Aries' },
  { id: '2', common_name: 'Goat',  generic_name: 'Goat',  scientific_name: 'Capra aegagrus hircus' },
]);
