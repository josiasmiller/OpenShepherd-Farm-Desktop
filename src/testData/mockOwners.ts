import type { Owner } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockOwners = new Success<Owner[]>([
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
]);
