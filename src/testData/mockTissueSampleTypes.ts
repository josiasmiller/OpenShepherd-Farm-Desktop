import type { TissueSampleType } from '@app/api';
import { Success } from '@common/core';

export const mockTissueSampleTypes = new Success<TissueSampleType[]>([
  { id: '1', name: 'Blood', display_order: 1 },
  { id: '2', name: 'Hair',  display_order: 2 },
]);
