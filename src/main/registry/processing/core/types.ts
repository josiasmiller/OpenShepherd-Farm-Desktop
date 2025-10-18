import { Species, ProcessingResult, RegistryRow, ValidationResult } from "packages/api";
import {Database} from "sqlite3";

export interface RegistryProcessor {
  validateRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species): Promise<ValidationResult[]>;
  processRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species): Promise<ProcessingResult>;
}
