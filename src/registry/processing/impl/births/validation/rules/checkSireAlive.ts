import { RegistryRow, ValidationResponse } from '../../../../core/types';
import { getAnimalDeathDate, getGestationPeriod, Species } from '../../../../../../database/index.js';
import { unwrapOrFailWithAnimal } from '../../../../../../shared/results/resultTypes.js';

export async function checkSireAlive(row: RegistryRow, species : Species): Promise<ValidationResponse> {
  const millisecondsInDay : number = 86400000;
  const errors: string[] = [];
  const { sireId, birthdate } = row;

  if (!sireId || !birthdate || !species) {
    if (!sireId) errors.push("Missing sire ID.");
    if (!birthdate) errors.push("Missing birthdate.");
    if (!species) errors.push("Missing species.");
    return { checkName: "checkSireAlive", errors, passed: errors.length === 0 };
  }

  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(species.id),
    "gestation period",
    sireId
  );
  if (gestationResult.tag === "error") {
    errors.push(gestationResult.error);
    return { checkName: "checkSireAlive", errors, passed: errors.length === 0 };
  }

  const { earlyDays } = gestationResult.data;
  const birthDate = new Date(birthdate);
  const earliestBreedingDate = new Date(birthDate.getTime() - earlyDays * millisecondsInDay);

  const deathDateResult = await unwrapOrFailWithAnimal(
    await getAnimalDeathDate(sireId),
    "sire death date",
    sireId
  );
  if (deathDateResult.tag === "error") {
    errors.push(deathDateResult.error);
    return { checkName: "checkSireAlive", errors, passed: errors.length === 0 };
  }

  const { deathDate: sireDeathDate } = deathDateResult.data as { deathDate: string | null };

  if (sireDeathDate == null) {
    // Sire is alive --> pass
    return { checkName: "checkSireAlive", errors, passed: true };
  }

  const sireDeath = new Date(sireDeathDate);
  if (isNaN(sireDeath.getTime())) {
    errors.push(`Invalid death date format for sire ${sireId}: ${sireDeathDate}`);
    return { checkName: "checkSireAlive", errors, passed: errors.length === 0 };
  }

  if (earliestBreedingDate > sireDeath) {
    errors.push(`Sire ${sireId} was deceased before breeding could occur (died ${sireDeathDate}).`);
  }

  return { checkName: "checkSireAlive", errors, passed: errors.length === 0 };
}
