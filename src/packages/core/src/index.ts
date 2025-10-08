export { Result, Success, Failure, handleResult, unwrapOrFailWithAnimal, unwrapOrThrow } from './resultTypes'
export { isUUIDv4 } from './helpers';

export function promiseFrom<T>(executor: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try { resolve(executor()) } catch (error) { reject(error) }
  })
}
