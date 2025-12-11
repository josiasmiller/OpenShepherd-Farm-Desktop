import { 
  MissingFieldsError,
  ParseError 
} from "../genericCodes";

export const NEW_BUYER_NOT_SUPPORTED = "NEW_BUYER_NOT_SUPPORTED";

export interface NewBuyerNotSupportedError {
  type: typeof NEW_BUYER_NOT_SUPPORTED;
}

export type TransferError = MissingFieldsError
  | ParseError
  | NewBuyerNotSupportedError;
