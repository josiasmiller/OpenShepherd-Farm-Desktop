import { unwrapOrFailWithAnimal } from 'packages/core';
import { RegistryRow, Species, ValidationResponse } from 'packages/api';
import {
  getGestationPeriod,
  getOffspringOfDam,
  OffspringInfo
} from '../../../../../../database';
import {Database} from "sqlite3";

/**
 * Validates that the dam has not had another offspring born too recently,
 * based on the species' minimum gestation period.
 */
export async function checkDamRecentOffspring(
  db: Database,
  row: RegistryRow,
  species: Species
): Promise<ValidationResponse> {
  const millisecondsInDay = 86400000;
  const errors: string[] = [];
  const { damId, birthdate } = row;

  if (!damId || !birthdate || !species) {
    if (!damId) errors.push("Missing dam ID.");
    if (!birthdate) errors.push("Missing birthdate.");
    if (!species) errors.push("Missing species.");

    return {
        checkName: "checkDamRecentOffspring",
        errors,
        passed: false,
    };
  }


  // 1. Get minimum gestation period for the species
  const gestationResult = await unwrapOrFailWithAnimal(
    await getGestationPeriod(db, species.id),
    "gestation period",
    damId
  );
  if (gestationResult.tag === "error") {
    errors.push(gestationResult.error);
    return {
      checkName: "checkDamRecentOffspring",
      errors,
      passed: errors.length === 0,
    };
  }

  const { earlyDays } = gestationResult.data;
  const recentBirthDate = new Date(birthdate);

  // 2. Get all previous offspring of the dam
  const offspringResult = await unwrapOrFailWithAnimal(
    await getOffspringOfDam(db, damId),
    "dam offspring",
    damId
  );
  if (offspringResult.tag === "error") {
    errors.push(offspringResult.error);
    return {
      checkName: "checkDamRecentOffspring",
      errors,
      passed: errors.length === 0,
    };
  }

  // 3. Check for conflicts with previous births
  for (const offspring of offspringResult.data as OffspringInfo[]) {
    const otherBirth = new Date(offspring.birthdate);
    const daysBetween = Math.abs(
      (recentBirthDate.getTime() - otherBirth.getTime()) / millisecondsInDay
    );

    if (daysBetween < earlyDays) {
      errors.push(
        `Dam ${damId} had offspring (${offspring.id}) born only ${Math.floor(
          daysBetween
        )} days before this one. Minimum interval is ${earlyDays} days.`
      );
    }
  }

  return {
    checkName: "checkDamRecentOffspring",
    errors,
    passed: errors.length === 0,
  };
}
