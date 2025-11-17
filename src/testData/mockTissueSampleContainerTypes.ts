import type { TissueSampleContainerType } from '@app/api';
import { Success } from '@common/core';

export const mockTissueSampleContainerTypes = new Success<TissueSampleContainerType[]>([
  { id: '1', name: 'Tube',     display_order: 1 },
  { id: '2', name: 'Envelope', display_order: 2 },
]);
