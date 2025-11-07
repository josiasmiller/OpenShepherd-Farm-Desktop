import {Database} from "sqlite3";
import { Species, ProcessingResult, RegistryRow, ValidationResult, ParseResult } from '@app/api';

export interface RegistryProcessor {
  validateRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species, parseResult: ParseResult<any>): Promise<ValidationResult[]>;
  processRegistryRows(db: Database, sections: Record<string, RegistryRow[]>, species: Species, parseResult: ParseResult<any>): Promise<ProcessingResult>;
}
