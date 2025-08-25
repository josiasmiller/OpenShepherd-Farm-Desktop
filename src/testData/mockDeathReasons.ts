import type { DeathReason } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockDeathReasons = new Success<DeathReason[]>([
  { id: '1', name: 'Natural Causes', display_order: 1 },
  { id: '2', name: 'Disease', display_order: 2 },
  { id: '3', name: 'Predator Attack', display_order: 3 },
]);
