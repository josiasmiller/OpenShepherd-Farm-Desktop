import type { TissueSampleContainerType } from 'packages/api';
import { Success } from 'packages/core';

export const mockTissueSampleContainerTypes = new Success<TissueSampleContainerType[]>([
  { id: '1', name: 'Tube',     display_order: 1 },
  { id: '2', name: 'Envelope', display_order: 2 },
]);
