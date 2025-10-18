import { handleResult } from 'packages/core';
import { RegistryRow, ValidationResponse } from 'packages/api';
import { AnimalDeathDate, getAnimalDeathDate } from '../../../../../../database';
import {Database} from "sqlite3";

export async function checkIsAnimalAlreadyDead(db: Database, row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];
  const animalId = row.animalId;
  const animalName = row.name;

  var ddResult = await getAnimalDeathDate(db, animalId);

  var animalDd : AnimalDeathDate;

  await handleResult(ddResult, {
    success: (data: AnimalDeathDate) => {
      animalDd = data;
    },
    error: (err: string) => {
      console.error("Failed to fetch AnimalDeathDate:", err);
      throw new Error(err);
    },
  });

  animalDd = animalDd!;

  if (animalDd.deathDate != null) {
    errors.push(`animal with ID=\'${animalId}\' and name=\'${animalName}\' died on \'${animalDd.deathDate}\'`);
  }

  return { checkName: "checkAnimalAlive", errors, passed: errors.length === 0 };
}
