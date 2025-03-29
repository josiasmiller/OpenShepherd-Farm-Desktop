// generic Result type
export type Result<T, E> = Success<T> | Failure<E>;

// Success class to represent a successful operation
export class Success<T> {
    readonly tag = "success";
    constructor(public readonly data: T) {}
}

// Failure class to represent a failed operation
export class Failure<E> {
    readonly tag = "error";
    constructor(public readonly error: E) {}
}

// Utility function to process a Result value
type ResultHandler<T, E, R> = {
    success: (data: T) => R;
    error: (error: E) => R;
};

export function handleResult<T, E, R>(
    result: Result<T, E>,
    handlers: ResultHandler<T, E, R>
): R {
    return result.tag === "success" ? handlers.success(result.data) : handlers.error(result.error);
}
