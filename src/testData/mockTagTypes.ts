import type { TagType } from '@app/api';
import { Success } from '@common/core';

export const mockTagTypes = new Success<TagType[]>([
  { id: '1', name: 'Visual', display_order: 1 },
  { id: '2', name: 'RFID', display_order: 2 },
]);
