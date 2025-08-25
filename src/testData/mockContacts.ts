import type { Contact } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockContacts = new Success<Contact[]>([
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
]);
