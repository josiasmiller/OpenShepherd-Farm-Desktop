import { Species } from "../../../database/index.js";
import { registryProcessorFactory } from "../core/registryProcessorFactory.js";
import {
  RegistryProcessType,
  RegistryRow,
  ProcessingResult,
  RegistryProcessor,
  ValidationResult,
} from "../core/types.js";

export async function handleRegistryProcess(
  processType: RegistryProcessType,
  rows: RegistryRow[],
  species: Species,
): Promise<ProcessingResult> {
  const processor : RegistryProcessor = registryProcessorFactory(processType);

  const validationResults : ValidationResult[] = await processor.validateRegistryRows(rows, species);
  const hasErrors = validationResults.some((r) => !r.isValid);

  if (hasErrors) {
    const allErrors: string[] = validationResults
      .filter((r) => !r.isValid)
      .flatMap((r) => r.errors);

    console.error("Validation failed:", allErrors);
    return {
      success: false,
      errors: allErrors,
    };
  }

  return processor.processRegistryRows(rows, species);
}
