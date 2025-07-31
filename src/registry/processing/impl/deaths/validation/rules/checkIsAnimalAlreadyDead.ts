import { RegistryRow, ValidationResponse } from '../../../../core/types.js';
import { AnimalDeathDate, getAnimalDeathDate } from '../../../../../../database/index.js';
import { handleResult } from '../../../../../../shared/results/resultTypes.js';

export async function checkIsAnimalAlreadyDead(row: RegistryRow): Promise<ValidationResponse> {
  const errors: string[] = [];
  const animalId = row.animalId;

  var ddResult = await getAnimalDeathDate(animalId);

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
    errors.push(`animal with ID=\'${animalId}\' died on \'${animalDd.deathDate}\'`);
  }

  return { checkName: "checkAnimalAlive", errors, passed: errors.length === 0 };
}
