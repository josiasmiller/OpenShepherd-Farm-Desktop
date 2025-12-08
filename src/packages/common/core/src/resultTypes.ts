/**
 * Type that represents the result of an operation
 */
export type Result<T, E> = Success<T> | Failure<E>;

/**
 * Type that represents a successful operation
 */
export class Success<T> {
  readonly tag = "success";
  constructor(public readonly data: T) {}
}

/**
 * Type that represents a failed operation
 */
export class Failure<E> {
  readonly tag = "error";
  constructor(public readonly error: E) {}
}

/**
 * Extracts the data of a successful result or null if the result
 * is a failure.
 *
 * @param result The result of an operation
 */
export function dataOrNull<T, E>(result: Result<T, E>): T | null {
  if (result.tag === "error") {
    return null
  } else {
    return result.data
  }
}

/**
 * Extracts the data of a successful result or throws an Error if
 * the result is a failure.
 *
 * @param result The result of an operation
 * @param messageBlock Optional block to create a message for the thrown Error
 */
export function dataOrThrow<T, E>(result: Result<T, E>, messageBlock?:(error: E) => string): T {
  if (result.tag === "success") {
    return result.data
  } else {
    throw new Error(messageBlock?.(result.error) ?? "")
  }
}

export async function unwrapOrThrow<T, E extends string>(
  promise: Promise<Result<T, E>>
): Promise<T> {
  const result = await promise;
  if (result.tag === "success") return result.data;
  throw new Error(result.error);
}

/**
 * This helper method can be used to assist in
 * mapping a result to a value R regardless of
 * whether the original result was successful
 * or failed.
 *
 * const desiredCount: Result<number, string> = getDesiredCount()
 * const dialogString: string = await handleResult(result, {
 *   success: (count: number) => {
 *     return "blah".repeat(count)
 *   },
 *   failure: (error: string) => {
 *     return `blah: ${error}`
 *   }
 * })
 *
 * Also, useful to map results to follow up actions.
 *
 * const result: Result<number, string> = doSomeWork()
 * handleResult(result, {
 *   success: (value: number) => {
 *     processResultOfWork(value)
 *   },
 *   failure: (error: string) => {
 *     reportError(error)
 *   }
 * })
 *
 * Use helpers like dataOrNull or dataOrThrow when extracting
 * values from a Result<T,E>, don't rely on success or failure
 * callbacks to create side effects with success or failure data.
 *
 * @param result A result to mapped to a value R
 * @param handlers An object referencing mapping
 * functions for success and failure cases.
 */
export function handleResult<T, E, R>(
  result: Result<T, E>,
  handlers: {
    success: (data: T) => Promise<R> | R;
    error: (error: E) => Promise<R> | R;
  }
): Promise<R> {
  if (result.tag === "success") {
    return Promise.resolve(handlers.success(result.data));
  } else {
    return Promise.resolve(handlers.error(result.error));
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
