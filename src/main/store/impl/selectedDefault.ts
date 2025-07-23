import type { DefaultSettingsResults } from '../../../database/index';
import { getStoreItem, setStoreItem } from '../core';

export function setStoreSelectedDefault(value: DefaultSettingsResults) {
  setStoreItem('selectedDefault', value);
}

export function getStoreSelectedDefault(): DefaultSettingsResults | null {
  return getStoreItem('selectedDefault');
}
