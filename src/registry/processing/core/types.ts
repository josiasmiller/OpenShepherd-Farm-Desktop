export type RegistryProcessType = 'births' | 'deaths';

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
}

export interface ProcessingResult {
  success: boolean;
  error?: string;
  insertedRowCount?: number;
}

export interface RegistryProcessor {
  validateRegistryRows(rows: RegistryRow[]): Promise<ValidationResult[]>;
  processRegistryRows(rows: RegistryRow[]): Promise<ProcessingResult>;
}

export type ValidationResponse = {
  checkName: string;
  errors: string[];
  warnings?: string[];
  passed?: boolean;
};
