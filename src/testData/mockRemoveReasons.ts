import type { RemoveReason } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockRemoveReasons = new Success<RemoveReason[]>([
  { id: '1', name: 'Replaced', display_order: 1 },
  { id: '2', name: 'Damaged',  display_order: 2 },
]);
