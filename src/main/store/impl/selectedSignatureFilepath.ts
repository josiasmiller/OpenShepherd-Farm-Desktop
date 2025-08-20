import { getStoreItem, setStoreItem } from '../core';

export function setStoreSelectedFilepath(value: string) {
  setStoreItem('selectedSignatureFilepath', value);
}

export function getStoreSelectedFilepath(): string {
  return getStoreItem('selectedSignatureFilepath');
}
