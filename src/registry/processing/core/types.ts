import { Species } from "../../../database";

export type RegistryProcessType = 'births' | 'registrations' | 'deaths';

export interface RegistryRow {
  [key: string]: any;
}

export interface ValidationResult {
  rowIndex: number;
  isValid: boolean;
  errors: string[];
}

export interface RegistryProcessRequest {
  processType: RegistryProcessType;
  rows: RegistryRow[];
  species: Species;
}

export interface ProcessingResult {
  success: boolean;
  errors?: string[];
  insertedRowCount?: number;
}

export interface RegistryProcessor {
  validateRegistryRows(rows: RegistryRow[], species: Species): Promise<ValidationResult[]>;
  processRegistryRows(rows: RegistryRow[], species: Species): Promise<ProcessingResult>;
}

export type ValidationResponse = {
  checkName: string;
  errors: string[];
  warnings?: string[];
  passed?: boolean;
};
