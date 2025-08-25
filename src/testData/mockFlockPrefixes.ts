import type { FlockPrefix } from '../main/database';
import { OwnerType } from '../main/database/client-types';
import { Success } from 'packages/core/src/resultTypes';

export const mockFlockPrefixes = new Success<FlockPrefix[]>([
  { 
    id: '1', 
    name: "John's Super Flock ",
    owner_id: "1", // make sure this lines up with an existing owner from `mockOwners.ts`
    owner_type: OwnerType.CONTACT,
    registry_company_id: null,
  },
  { 
    id: '2', 
    name: 'JaneFlock',
    owner_id: "2", // make sure this lines up with an existing owner from `mockOwners.ts`
    owner_type: OwnerType.CONTACT,
    registry_company_id: null,
  },
]);
