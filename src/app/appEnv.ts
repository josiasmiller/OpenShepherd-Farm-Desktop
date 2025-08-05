import { AppVariant, DEFAULT_APP_VARIANT, optAppVariantFromString } from "./appVariant";

/**
 * Reads the application variant from the process environment
 * from environment variable APP_VARIANT.
 */
export function appVariantFromEnv(): AppVariant {
    return optAppVariantFromString(process.env.APP_VARIANT) ?? DEFAULT_APP_VARIANT
}
