import { AppVariant, appVariantFromString } from "@app/variant";

declare const __APP_VARIANT__: string
declare const __APP_BUILD_VERSION__: string
declare const __APP_BUILD_TIMESTAMP__: string
declare const __APP_BUILD_COMMIT_SHORT_SHA__: string
declare const __APP_BUILD_COMMIT_FULL_SHA__: string

const BUILD_APP_VARIANT = appVariantFromBuild()

export type AppAboutInfo = {
  name: string,
  version: string,
  commitSHAShort: string,
  commitSHAFull: string,
  buildTimeStamp: string,
}

export const AboutApp: AppAboutInfo = {
  name: isRegistryDesktop() ? 'AnimalTrakker Registry' : 'AnimalTrakker Farm',
  version: __APP_BUILD_VERSION__,
  commitSHAShort: __APP_BUILD_COMMIT_SHORT_SHA__,
  commitSHAFull: __APP_BUILD_COMMIT_FULL_SHA__,
  buildTimeStamp: __APP_BUILD_TIMESTAMP__
} as const

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
