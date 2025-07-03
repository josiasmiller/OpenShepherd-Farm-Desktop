import { RegistryRow, ValidationResponse } from '../../../core/types';
import { getGestationPeriod, getAnimalBirthDate, getBreedingAges } from '../../../../../database/index.js';
import { unwrapOrFailWithAnimal } from '../../../../../shared/results/resultTypes.js';

export async function checkSireBreedingAge(row: RegistryRow): Promise<ValidationResponse> {
  const millisecondsInDay = 86400000;
  const errors: string[] = [];
  const { sireId, birthdate, species } = row;

  if (!sireId || !birthdate || !species) {
    return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
  }

  // Get gestation period
  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(species),
    "gestation period",
    sireId
  );
  if (gestationResult.tag === "error") {
    errors.push(gestationResult.error);
    return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
  }

  const { lateDays } = gestationResult.data; // using max gestation time
  const birthDate = new Date(birthdate);
  const breedingDate = new Date(birthDate.getTime() - lateDays * millisecondsInDay);

  // Get sire birthdate
  const sireBdayResult = await unwrapOrFailWithAnimal(
    await getAnimalBirthDate(sireId),
    "sire animal identification",
    sireId
  );
  if (sireBdayResult.tag === "error") {
    errors.push(sireBdayResult.error);
    return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
  }

  const sireBirth : Date = sireBdayResult.data;
  const sireAgeAtBreeding = Math.floor((breedingDate.getTime() - sireBirth.getTime()) / millisecondsInDay);

  // Get species-specific breeding ages
  const breedingAgesResult = await unwrapOrFailWithAnimal(
    await getBreedingAges(species),
    "breeding ages",
    sireId
  );
  if (breedingAgesResult.tag === "error") {
    errors.push(breedingAgesResult.error);
    return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
  }

  const { maleDays } = breedingAgesResult.data;
  if (sireAgeAtBreeding < maleDays) {
    errors.push(`Sire ${sireId} was too young to breed on ${breedingDate.toISOString().split('T')[0]} (age: ${sireAgeAtBreeding} days, required: ${maleDays}).`);
  }

  return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
}
