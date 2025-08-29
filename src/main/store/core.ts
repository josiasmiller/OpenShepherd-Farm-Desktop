import Store from 'electron-store';
import type { DefaultSettingsResults, Species } from 'packages/api';

export type AppStoreSchema = {
  selectedDefault: DefaultSettingsResults | null;
  selectedSpecies: Species | null;
  selectedSignatureFilepath: string;
  // extend as needed
};

export const store = new Store<AppStoreSchema>({
  defaults: {
    selectedDefault: null,
    selectedSpecies: null,
    selectedSignatureFilepath: null,
  },
});

// Generic setter
export function setStoreItem<K extends keyof AppStoreSchema>(key: K, value: AppStoreSchema[K]) {
  store.set(key, value);
}

// Generic getter
export function getStoreItem<K extends keyof AppStoreSchema>(key: K): AppStoreSchema[K] {
  return store.get(key, null as AppStoreSchema[K]);
}