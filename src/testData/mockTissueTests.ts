import type { TissueTest } from '@app/api';
import { Success } from '@common/core';

export const mockTissueTests = new Success<TissueTest[]>([
  { id: '1', name: 'Scrapie Test', display_order: 1 },
  { id: '2', name: 'Genetic Test', display_order: 2 },
]);
