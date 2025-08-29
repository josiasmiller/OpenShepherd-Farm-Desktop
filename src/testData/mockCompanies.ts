import type { Company } from 'packages/api';
import { Success } from 'packages/core';

export const mockCompanies = new Success<Company[]>([
  { id: "1", name: "FarmCo"   },
  { id: "2", name: "AgriCorp" },
]);
