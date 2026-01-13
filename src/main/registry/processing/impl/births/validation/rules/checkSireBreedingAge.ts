import { unwrapOrFailWithAnimal } from '@common/core';
import { Species, BirthNotification, ValidationResponse } from '@app/api';
import { getGestationPeriod, getAnimalBirthDate, getBreedingAges } from '../../../../../../database';
import {Database} from "sqlite3";

export async function checkSireBreedingAge(db: Database, bn: BirthNotification, species : Species): Promise<ValidationResponse> {
  const millisecondsInDay = 86400000;
  const errors: string[] = [];

  const sireId : string = bn.sireId;
  const birthdate : string = bn.birthdate;

  if (!sireId || !birthdate || !species) {
    if (!sireId) errors.push("Missing sire ID.");
    if (!birthdate) errors.push("Missing birthdate.");
    if (!species) errors.push("Missing species.");
    return { checkName: "checkSireBreedingAge", errors, passed: errors.length === 0 };
  }

  // Get gestation period
  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(db, species.id),
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
    await getAnimalBirthDate(db, sireId),
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
    await getBreedingAges(db, species.id),
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
