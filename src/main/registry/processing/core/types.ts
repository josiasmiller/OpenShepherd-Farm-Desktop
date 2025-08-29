import { Species, ProcessingResult, RegistryRow, ValidationResult } from "packages/api";

export interface RegistryProcessor {
  validateRegistryRows(sections: Record<string, RegistryRow[]>, species: Species): Promise<ValidationResult[]>;
  processRegistryRows(sections: Record<string, RegistryRow[]>, species: Species): Promise<ProcessingResult>;
}
