import type { Species } from 'packages/api';
import { getStoreItem, setStoreItem } from '../core';

export function setStoreSelectedSpecies(value: Species) {
  setStoreItem('selectedSpecies', value);
}

export function getStoreSelectedSpecies(): Species | null {
  return getStoreItem('selectedSpecies');
}
