import type { Company } from '../main/database';
import { Success } from 'packages/core/src/resultTypes';

export const mockCompanies = new Success<Company[]>([
  { id: "1", name: "FarmCo"   },
  { id: "2", name: "AgriCorp" },
]);
