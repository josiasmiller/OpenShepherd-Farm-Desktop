import type { TagType } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockTagTypes = new Success<TagType[]>([
  { id: '1', name: 'Visual', display_order: 1 },
  { id: '2', name: 'RFID', display_order: 2 },
]);
