import {Database} from "sqlite3";
import { Species, ProcessingResult, RegistryRow, ValidationResult } from '@app/api';

export interface RegistryProcessor {
  validateRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species): Promise<ValidationResult[]>;
  processRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species): Promise<ProcessingResult>;
}
