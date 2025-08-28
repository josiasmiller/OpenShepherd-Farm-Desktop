import type { Contact } from 'packages/api';
import { Success } from 'packages/core';

export const mockContacts = new Success<Contact[]>([
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
]);
