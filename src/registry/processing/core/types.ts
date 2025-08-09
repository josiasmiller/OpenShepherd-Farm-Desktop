import { Species } from "../../../database";

export type RegistryProcessType = 'births' | 'registrations' | 'deaths' | 'transfers';

export interface RegistryRow {
  [key: string]: any;
}

export type ParseResult<T> = {
  data: T;
  warnings: string[];
};



export interface ValidationResult {
  rowIndex: number;
  isValid: boolean;
  errors: string[];
}

export interface RegistryProcessRequest {
  processType: RegistryProcessType;
  species: Species;
  sections: Record<string, RegistryRow[]>;
}

export interface ProcessingResult {
  success: boolean;
  errors?: string[];
  insertedRowCount?: number;
}

export interface RegistryProcessor {
  validateRegistryRows(sections: Record<string, RegistryRow[]>, species: Species): Promise<ValidationResult[]>;
  processRegistryRows(sections: Record<string, RegistryRow[]>, species: Species): Promise<ProcessingResult>;
}

export type ValidationResponse = {
  checkName: string;
  errors: string[];
  warnings?: string[];
  passed?: boolean;
};
