import { AppVariant, appVariantFromString } from "./appVariant";

const BUILD_APP_VARIANT = appVariantFromBuild()

/**
 * Reads the application variant from defined constants
 * generated at build time, __APP_VARIANT__
 */
export function appVariantFromBuild(): AppVariant {
    return appVariantFromString(__APP_VARIANT__)
}

/**
 * Helper method that returns true if the current application
 * variant is Farm
 */
export function isFarmDesktop(): boolean {
    return BUILD_APP_VARIANT === AppVariant.Farm
}

/**
 * Helper method that returns true if the current application
 * variant is Registry
 */
export function isRegistryDesktop(): boolean {
    return BUILD_APP_VARIANT === AppVariant.Registry
}
