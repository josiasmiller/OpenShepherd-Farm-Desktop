import { handleResult } from "../../../../../../shared/results/resultTypes";
import { CoatColor, getCoatColorForAnimal } from "../../../../../../database";
import { ValidationResponse } from "../../../../core/types";

const allowedColorCombinations: Record<string, string[]> = {

  // TODO --> implement correct mapping of which animals can breed which colors
  //          also include chocolate!

  "White|White": ["White"],
  "White|Black": ["White", "Black"],
  "Black|Black": ["Black"],
  "Black|Brown": ["Black", "Brown"],
};

function canProduce(sireColor: string, damColor: string, offspringColor: string): boolean {
  const combo = [sireColor, damColor].sort().join("|");
  const allowed = allowedColorCombinations[combo];
  return allowed ? allowed.includes(offspringColor) : false;
}

export const verifyCoatColorAccuracy = async (
  sireId: string,
  damId: string,
  offspringId: string
): Promise<ValidationResponse> => {
  const checkName = "Coat Color Accuracy";
  const errors: string[] = [];

  let sireColor: string | null = null;
  let damColor: string | null = null;
  let offspringColor: string | null = null;

  try {
    const sireResult = await getCoatColorForAnimal(sireId);
    await handleResult(sireResult, {
      success: (color: CoatColor) => {
        if (!color || !color.name) throw new Error(`No coat color found for sire id=${sireId}`);
        sireColor = color.name;
      },
      error: (err) => {
        throw new Error(`Failed to get coat color for sire id=${sireId}: ${err}`);
      },
    });

    const damResult = await getCoatColorForAnimal(damId);
    await handleResult(damResult, {
      success: (color: CoatColor) => {
        if (!color || !color.name) throw new Error(`No coat color found for dam id=${damId}`);
        damColor = color.name;
      },
      error: (err) => {
        throw new Error(`Failed to get coat color for dam id=${damId}: ${err}`);
      },
    });

    const offspringResult = await getCoatColorForAnimal(offspringId);
    await handleResult(offspringResult, {
      success: (color: CoatColor) => {
        if (!color || !color.name) throw new Error(`No coat color found for offspring id=${offspringId}`);
        offspringColor = color.name;
      },
      error: (err) => {
        throw new Error(`Failed to get coat color for offspring id=${offspringId}: ${err}`);
      },
    });

    if (!canProduce(sireColor!, damColor!, offspringColor!)) {
      errors.push(`Invalid coat color combination: ${sireColor} x ${damColor} cannot produce ${offspringColor}`);
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return {
    checkName,
    errors,
    passed: errors.length === 0,
  };
};
