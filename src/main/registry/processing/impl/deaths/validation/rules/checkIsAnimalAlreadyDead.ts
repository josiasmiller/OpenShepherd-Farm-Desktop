import { handleResult } from '@common/core';
import {AnimalDeath, ValidationResponse} from '@app/api';
import { AnimalDeathDate, getAnimalDeathDate } from '../../../../../../database';
import {Database} from "@database/async";

export async function checkIsAnimalAlreadyDead(db: Database, row: AnimalDeath): Promise<ValidationResponse> {
  const errors: string[] = [];
  const animalId = row.animalId;
  const animalName = row.name;

  let ddResult = await getAnimalDeathDate(db.raw(), animalId);

  let animalDd : AnimalDeathDate;

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
