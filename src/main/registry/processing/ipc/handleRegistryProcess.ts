import {
  Species,
  RegistryProcessType,
  RegistryRow,
  ProcessingResult,
  ValidationResult,
} from "packages/api";
import { registryProcessorFactory } from "../core/registryProcessorFactory";
import {
  RegistryProcessor,
} from "../core/types";

export async function handleRegistryProcess(
  processType: RegistryProcessType,
  species: Species,
  sections: Record<string, RegistryRow[]>,
): Promise<ProcessingResult> {

  const processor : RegistryProcessor = registryProcessorFactory(processType);
  const validationResults : ValidationResult[] = await processor.validateRegistryRows(sections, species);
  const hasErrors = validationResults.some((r) => !r.isValid);

  if (hasErrors) {
    const allErrors: string[] = validationResults
      .filter((r) => !r.isValid)
      .flatMap((r) => r.errors);

    return {
      success: false,
      errors: allErrors,
    };
  }

  return processor.processRegistryRows(sections, species);
}
