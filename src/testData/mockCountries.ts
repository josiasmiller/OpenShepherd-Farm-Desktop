import type { Country } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockCountries = new Success<Country[]>([
  { id: '1', name: 'United States',  abbreviation: 'US', display_order: 1 },
  { id: '2', name: 'Canada',         abbreviation: 'CA', display_order: 2 },
  { id: '3', name: 'United Kingdom', abbreviation: 'UK', display_order: 3 },
]);
