//LEAVE THIS IMPORT UNSHORTENED
import { optAppVariantFromString, DEFAULT_APP_VARIANT } from '../src/packages/app/variant/src/index';

/**
 * Reads the application variant from the process environment
 * from environment variable APP_VARIANT.
 */
export function appVariantFromEnv(): string {
    return optAppVariantFromString(process.env.APP_VARIANT) ?? DEFAULT_APP_VARIANT
}
