import { DeathParseRow } from '@app/api';

export const deathParseMap: Record<string, keyof DeathParseRow> = {
  DEATH_DATE: 'deathDate',
  ID_ANIMALID: 'animalId',
  PREFIX_KEY: 'prefixKey',
  PREFIX: 'prefix',
  NAME: 'name',
  REGISTRATION_NUMBER: 'registrationNumber',
  REASON_KEY: 'reasonKey',
  REASON: 'reason',
  NOTES: 'notes',
};
