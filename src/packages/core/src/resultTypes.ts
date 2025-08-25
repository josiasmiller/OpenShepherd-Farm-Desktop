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
//TODO: What is happening with this type?
type ResultHandler<T, E, R> = {
    success: (data: T) => R;
    error: (error: E) => R;
};

export async function handleResult<T, E, R>(
    result: Result<T, E>,
    handlers: {
        success: (data: T) => Promise<R> | R;
        error: (error: E) => Promise<R> | R;
    }
): Promise<R> {
    //TODO: Remove redundant await
    if (result.tag === "success") {
        return await handlers.success(result.data);
    } else {
        return await handlers.error(result.error);
    }
}

//TODO: Move this to a less general location.  It does not need to be common.
export const unwrapOrFailWithAnimal = async <T>(
  result: Result<T, string>,
  label: string,
  animalId: string
): Promise<Result<T, string>> => {
  if (result.tag === "success") {
    return new Success(result.data);
  } else {
    console.error(`${label} error for animal ID ${animalId}:`, result.error);
    return new Failure(`Failed to get ${label} for animal ID ${animalId}`);
  }
};