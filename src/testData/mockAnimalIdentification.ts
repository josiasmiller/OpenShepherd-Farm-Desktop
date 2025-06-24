import type { AnimalIdentification } from '../database';
import { Success } from '../shared/results/resultTypes';

export const mockAnimalIdentification = new Success<AnimalIdentification[]>([
  { id: "1", flockPrefix: "Desert Weyr", name: "Samuel", registrationNumber: "12345", birthDate: new Date(Date.UTC(2012, 0, 1)) }, // Jan 1, 2012
  { id: "2", flockPrefix: "John Farms", name: "Bob", registrationNumber: "123456", birthDate: new Date(Date.UTC(2020, 5, 1)) },    // Jun 1, 2020
]);
