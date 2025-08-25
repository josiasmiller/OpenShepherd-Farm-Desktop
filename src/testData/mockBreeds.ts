import type { Breed } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockBreeds = new Success<Breed[]>([
  { id: '1', species_id: 'sheep', name: 'Merino', display_order: 1 },
  { id: '2', species_id: 'goat', name: 'Boer', display_order: 2 },
]);

