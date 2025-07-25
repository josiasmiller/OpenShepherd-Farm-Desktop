import Store from 'electron-store';
import { DefaultSettingsResults } from '../../database/index.js';

const store = new Store<{
  selectedDefault: DefaultSettingsResults | null;
}>();

let currentDefault: DefaultSettingsResults | null = store.get('selectedDefault', null);

export function setSelectedDefault(value: DefaultSettingsResults) {
  currentDefault = value;
  store.set('selectedDefault', value);
}

export function getSelectedDefault(): DefaultSettingsResults | null {
  return currentDefault;
}
