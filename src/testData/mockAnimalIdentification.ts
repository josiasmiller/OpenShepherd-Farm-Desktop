import type { AnimalIdentification } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockAnimalIdentification = new Success<AnimalIdentification[]>([
  { id: "1", flockPrefix: "Desert Weyr", name: "Samuel" },
  { id: "2", flockPrefix: "John Farms", name: "Bob" },
]);
