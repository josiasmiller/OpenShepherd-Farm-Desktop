import {
  MissingFieldsError,
  ParseError
} from "../genericCodes";

export type BirthError = MissingFieldsError | ParseError;
