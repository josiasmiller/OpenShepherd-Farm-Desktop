import { registryProcessorFactory } from "../core/registryProcessorFactory.js";
import {
  RegistryProcessType,
  RegistryRow,
  ProcessingResult,
} from "../core/types.js";

export async function handleRegistryProcess(
  processType: RegistryProcessType,
  rows: RegistryRow[]
): Promise<ProcessingResult> {
  const processor = registryProcessorFactory(processType);

  const validationResults = await processor.validate(rows);
  const hasErrors = validationResults.some((r) => !r.isValid);

  if (hasErrors) {
    console.error("Validation failed:", validationResults);
    return {
      success: false,
      error: "Validation failed",
    };
  }

  return processor.process(rows);
}
