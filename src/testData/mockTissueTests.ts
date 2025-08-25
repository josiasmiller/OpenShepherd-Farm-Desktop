import type { TissueTest } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockTissueTests = new Success<TissueTest[]>([
  { id: '1', name: 'Scrapie Test', display_order: 1 },
  { id: '2', name: 'Genetic Test', display_order: 2 },
]);
