import type { TagType } from 'packages/api';
import { Success } from 'packages/core';

export const mockTagTypes = new Success<TagType[]>([
  { id: '1', name: 'Visual', display_order: 1 },
  { id: '2', name: 'RFID', display_order: 2 },
]);
