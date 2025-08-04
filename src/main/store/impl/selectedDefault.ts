import type { DefaultSettingsResults } from '../../../database/index.js';
import { getStoreItem, setStoreItem } from '../core.js';

export function setStoreSelectedDefault(value: DefaultSettingsResults) {
  setStoreItem('selectedDefault', value);
}

export function getStoreSelectedDefault(): DefaultSettingsResults | null {
  return getStoreItem('selectedDefault');
}
