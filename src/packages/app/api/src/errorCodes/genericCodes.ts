
// =================================
// General Error Definitions
// =================================

export const DIALOG_CANCELLED = "DIALOG_CANCELLED";
export const MISSING_FIELDS = "MISSING_FIELDS";
export const PARSE_ERROR = "PARSE_ERROR";

// =================================
// Interface Definitions
// =================================

export interface DialogCancelledError {
  type: typeof DIALOG_CANCELLED;
}

export interface MissingFieldsError {
  type: typeof MISSING_FIELDS;
  missing?: string[];   // optional details to include
}

export interface ParseError {
  type: typeof PARSE_ERROR;
  details?: string;     // optional parse error information
}
