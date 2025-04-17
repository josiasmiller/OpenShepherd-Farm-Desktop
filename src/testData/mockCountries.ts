import type { Country } from '../database';

export const mockCountries: Country[] = [
  { id: '1', name: 'United States',  abbreviation: 'US', display_order: 1 },
  { id: '2', name: 'Canada',         abbreviation: 'CA', display_order: 2 },
  { id: '3', name: 'United Kingdom', abbreviation: 'UK', display_order: 3 },
];
