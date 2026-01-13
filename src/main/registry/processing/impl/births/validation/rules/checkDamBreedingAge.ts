import {Species, ValidationResponse, BirthNotification} from '@app/api';
import { getGestationPeriod, getAnimalBirthDate, getBreedingAges } from '../../../../../../database';
import {Database} from "sqlite3";
import { unwrapOrFailWithAnimal } from '@common/core';

export async function checkDamBreedingAge(db: Database, bn: BirthNotification, species: Species): Promise<ValidationResponse> {
  const millisecondsInDay = 86400000;
  const errors: string[] = [];

  const damId : string = bn.damId;
  const birthdate : string = bn.birthdate;

  if (!damId || !birthdate || !species) {
    if (!damId) errors.push("Missing dam ID.");
    if (!birthdate) errors.push("Missing birthdate.");
    if (!species) errors.push("Missing species.");
    
    return { checkName: "checkDamBreedingAge", errors, passed: errors.length === 0 };
  }

  // Get gestation period
  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(db, species.id),
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
    await getAnimalBirthDate(db, damId),
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
    await getBreedingAges(db, species.id),
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
