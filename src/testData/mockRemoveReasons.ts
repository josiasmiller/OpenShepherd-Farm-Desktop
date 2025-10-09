import type { RemoveReason } from '@app/api';
import { Success } from '@common/core';

export const mockRemoveReasons = new Success<RemoveReason[]>([
  { id: '1', name: 'Replaced', display_order: 1 },
  { id: '2', name: 'Damaged',  display_order: 2 },
]);
