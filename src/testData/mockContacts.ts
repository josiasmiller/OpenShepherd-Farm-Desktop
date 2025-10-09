import type { Contact } from '@app/api';
import { Success } from '@common/core';

export const mockContacts = new Success<Contact[]>([
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
]);
