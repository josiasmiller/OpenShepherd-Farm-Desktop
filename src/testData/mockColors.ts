import type { Color } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockColors = new Success<Color[]>([
  { id: '1', name: 'Black', display_order: 1 },
  { id: '2', name: 'White', display_order: 2 },
  { id: '3', name: 'Green', display_order: 3 },
]);
