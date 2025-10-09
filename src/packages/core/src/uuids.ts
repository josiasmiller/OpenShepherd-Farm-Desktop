import { validate, version } from 'uuid/dist/esm-browser/index.js';


export function isUUIDv4(str: string): boolean {
  return validate(str) && version(str) === 4;
}