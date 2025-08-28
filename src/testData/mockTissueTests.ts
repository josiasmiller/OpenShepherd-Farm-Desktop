import type { TissueTest } from 'packages/api';
import { Success } from 'packages/core';

export const mockTissueTests = new Success<TissueTest[]>([
  { id: '1', name: 'Scrapie Test', display_order: 1 },
  { id: '2', name: 'Genetic Test', display_order: 2 },
]);
