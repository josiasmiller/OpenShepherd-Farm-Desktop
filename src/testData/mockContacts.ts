import type { Contact } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockContacts = new Success<Contact[]>([
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
]);
