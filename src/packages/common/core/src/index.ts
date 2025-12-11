export {
  Result,
  Success,
  Failure,
  Fulfillment,
  handleResult,
  unwrapOrFailWithAnimal,
  unwrapOrThrow,
  dataOrNull,
  dataOrThrow,
  cancelled,
} from './resultTypes'
export { isUUIDv4 } from './uuids';

export function promiseFrom<T>(executor: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try { resolve(executor()) } catch (error) { reject(error) }
  })
}
