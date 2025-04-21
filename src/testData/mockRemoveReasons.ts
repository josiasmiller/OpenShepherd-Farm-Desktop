import type { RemoveReason } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockRemoveReasons = new Success<RemoveReason[]>([
  { id: '1', name: 'Replaced', display_order: 1 },
  { id: '2', name: 'Damaged',  display_order: 2 },
]);
