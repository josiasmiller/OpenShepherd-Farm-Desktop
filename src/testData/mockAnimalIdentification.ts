import type { AnimalIdentification } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockAnimalIdentification = new Success<AnimalIdentification[]>([
  { id: "1", flockPrefix: "Desert Weyr", name: "Samuel", registrationNumber: "12345" },
  { id: "2", flockPrefix: "John Farms", name: "Bob", registrationNumber: "123456" },
]);
