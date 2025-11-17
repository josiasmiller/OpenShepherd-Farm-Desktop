/**
 * Indicates the application type variant
 * of a specific build of the application.
 *
 * Farm - The AnimalTrakker Farm Desktop Application
 * Registry - The AnimalTrakker Registry Desktop Application
 */
export enum AppVariant {
    Farm = 'farm',
    Registry = 'registry'
}

/**
 * The default application variant to be used if no variant
 * is indicated in the process environment.
 */
export const DEFAULT_APP_VARIANT = AppVariant.Farm

/**
 * Converts a string value to an AppVariant or throws if the string
 * value is null, undefined, or not a valid AppVariant string.
 * @param value
 */
export function appVariantFromString(value: string): AppVariant {
    const appVariant = optAppVariantFromString(value)
    if (appVariant === undefined) {
        throw new Error("value cannot be undefined")
    } else if (appVariant === null) {
        throw new Error("value cannot be null")
    }
    return appVariant
}

/**
 * Converts a string value to an AppVariant.  Returns
 * null or undefined respectively if the string value
 * is null or undefined, throws if the string value
 * is not a valid AppVariant string.
 * @param value
 */
export function optAppVariantFromString(value: string | null | undefined): AppVariant | null | undefined {
    switch (value) {
        case AppVariant.Farm: return AppVariant.Farm
        case AppVariant.Registry: return AppVariant.Registry
        case null: return null
        case undefined: return undefined
        default: throw new Error(`'${value}' is not a valid application variant.`)
    }
}
