import type { Unit } from '../database';

// note --> the `unit type` field should reference the correspdoning ID from `mockUnitTypes.ts`

export const mockWeightUnits: Unit[] = [
  { id: "1", name: "Kilogram", unit_type: "1", display_order: 1 },
  { id: "2", name: "Pound",  unit_type: "1", display_order: 2 },
];

export const mockCurrencyUnits: Unit[] = [
  { id: "1", name: "US Dollar", unit_type: "2", display_order: 1 },
  { id: "2", name: "Euro", unit_type: "2", display_order: 2 },
];