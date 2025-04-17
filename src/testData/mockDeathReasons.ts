import type { DeathReason } from '../database';

export const mockDeathReasons: DeathReason[] = [
  { id: '1', name: 'Natural Causes', display_order: 1 },
  { id: '2', name: 'Disease', display_order: 2 },
  { id: '3', name: 'Predator Attack', display_order: 3 },
];
