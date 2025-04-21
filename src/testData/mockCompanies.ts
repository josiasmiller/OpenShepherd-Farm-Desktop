import type { Company } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockCompanies = new Success<Company[]>([
  { id: "1", name: "FarmCo"   },
  { id: "2", name: "AgriCorp" },
]);
