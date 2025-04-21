import type { TissueTest } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockTissueTests = new Success<TissueTest[]>([
  { id: '1', name: 'Scrapie Test', display_order: 1 },
  { id: '2', name: 'Genetic Test', display_order: 2 },
]);
