import type { TissueSampleType } from 'packages/api';
import { Success } from 'packages/core';

export const mockTissueSampleTypes = new Success<TissueSampleType[]>([
  { id: '1', name: 'Blood', display_order: 1 },
  { id: '2', name: 'Hair',  display_order: 2 },
]);
