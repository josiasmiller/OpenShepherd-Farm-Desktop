import {
    MissingFieldsError,
    ParseError
} from "../genericCodes";


export type DeathError =
    | MissingFieldsError
    | ParseError;
