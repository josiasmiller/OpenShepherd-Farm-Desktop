import type { Company } from '@app/api';
import { Success } from '@common/core';

export const mockCompanies = new Success<Company[]>([
  { id: "1", name: "FarmCo"   },
  { id: "2", name: "AgriCorp" },
]);
