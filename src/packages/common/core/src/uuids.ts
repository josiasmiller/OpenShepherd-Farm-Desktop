import { validate, version } from 'uuid';


export function isUUIDv4(str: string): boolean {
  return validate(str) && version(str) === 4;
}