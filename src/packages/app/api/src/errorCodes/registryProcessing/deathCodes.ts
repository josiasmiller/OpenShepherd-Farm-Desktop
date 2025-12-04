import {
    DialogCancelledError,
    MissingFieldsError,
    ParseError
} from "../genericCodes";


export type DeathError =
    | DialogCancelledError
    | MissingFieldsError
    | ParseError;
