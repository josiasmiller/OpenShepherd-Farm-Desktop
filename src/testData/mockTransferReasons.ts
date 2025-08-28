import type { TransferReason } from 'packages/api';
import { Success } from 'packages/core';

export const mockTransferReasons = new Success<TransferReason[]>([
  { id: '1', name: 'Moved to different farm', display_order: 1 },
  { id: '2', name: 'Transferred to research', display_order: 2 },
]);
