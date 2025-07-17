import { RegistryRow, ValidationResponse } from '../../../core/types';
import { getGestationPeriod, getAnimalBirthDate, getBreedingAges, Species } from '../../../../../database/index.js';
import { unwrapOrFailWithAnimal } from '../../../../../shared/results/resultTypes.js';

export async function checkDamBreedingAge(row: RegistryRow, species: Species): Promise<ValidationResponse> {
  const millisecondsInDay = 86400000;
  const errors: string[] = [];
  const { damId, birthdate } = row;

  if (!damId || !birthdate || !species) {
    return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
  }

  // Get gestation period
  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(species.id),
    "gestation period",
    damId
  );
  if (gestationResult.tag === "error") {
    errors.push(gestationResult.error);
    return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
  }

  const { lateDays } = gestationResult.data; // using max gestation time
  const birthDate = new Date(birthdate);
  const breedingDate = new Date(birthDate.getTime() - lateDays * millisecondsInDay);

  // Get dam birthdate
  const damBirthResult = await unwrapOrFailWithAnimal(
    await getAnimalBirthDate(damId),
    "dam birth date",
    damId
  );
  if (damBirthResult.tag === "error") {
    errors.push(damBirthResult.error);
    return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
  }

  const damBirth = new Date(damBirthResult.data);
  const damAgeAtBreeding = Math.floor((breedingDate.getTime() - damBirth.getTime()) / millisecondsInDay);

  // Get species-specific breeding ages
  const breedingAgesResult = await unwrapOrFailWithAnimal(
    await getBreedingAges(species.id),
    "breeding ages",
    damId
  );
  if (breedingAgesResult.tag === "error") {
    errors.push(breedingAgesResult.error);
    return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
  }

  const { femaleDays } = breedingAgesResult.data;
  if (damAgeAtBreeding < femaleDays) {
    errors.push(`Dam ${damId} was too young to breed on ${breedingDate.toISOString().split('T')[0]} (age: ${damAgeAtBreeding} days, required: ${femaleDays}).`);
  }

  return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
}
