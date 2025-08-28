import type { Sex } from 'packages/api';
import { Success } from 'packages/core';

export const mockSexes = new Success<Sex[]>([
  { id: '1', name: 'Male',   display_order: 1, species_id: null },
  { id: '2', name: 'Female', display_order: 2, species_id: null },
]);
