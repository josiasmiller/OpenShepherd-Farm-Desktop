import { DeathParseRow } from './deathParseRow.js';

export const deathParseMap: Record<string, keyof DeathParseRow> = {
  "DEATH DATE": 'deathDate', // not ideal for keys but since this is how the CSV stores it.. it must be this way for now
  ID_ANIMALID: 'animalId',
  PREFIX_KEY: 'prefixKey',
  PREFIX: 'prefix',
  NAME: 'name',
  REGISTRATION_NUMBER: 'registrationNumber',
  REASON_KEY: 'reasonKey',
  REASON: 'reason',
  NOTES: 'notes',
};
