import { getStoreItem, setStoreItem } from '../core';

export function setStoreSelectedFilepath(value: string | null) {
  setStoreItem('selectedSignatureFilepath', value);
}

export function getStoreSelectedFilepath(): string | null {
  return getStoreItem('selectedSignatureFilepath');
}
