import type { DefaultSettingsResults } from 'packages/api';
import { getStoreItem, setStoreItem } from '../core';

export function setStoreSelectedDefault(value: DefaultSettingsResults) {
  setStoreItem('selectedDefault', value);
}

export function getStoreSelectedDefault(): DefaultSettingsResults | null {
  return getStoreItem('selectedDefault');
}
