import type { FlockPrefix } from '../database';
import { OwnerType } from '../database/client-types';

export const mockFlockPrefixes: FlockPrefix[] = [
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
];
