// store/selectedSpecies.ts
import type { Species } from '../../../database/index.js';
import { getStoreItem, setStoreItem } from '../core.js';

export function setStoreSelectedSpecies(value: Species) {
  setStoreItem('selectedSpecies', value);
}

export function getStoreSelectedSpecies(): Species | null {
  return getStoreItem('selectedSpecies');
}
