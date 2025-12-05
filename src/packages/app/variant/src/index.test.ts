
import {DEFAULT_APP_VARIANT, AppVariant, appVariantFromString, optAppVariantFromString} from './index';

test('Default AppVariant should be Farm', () => {
    expect(DEFAULT_APP_VARIANT).toBe(AppVariant.Farm)
})

test('appVariantFromString throws on undefined', () => {
    expect(() => appVariantFromString(undefined as unknown as string)).toThrow()
})

test('appVariantFromString throws on null', () => {
    expect(() => appVariantFromString(undefined as unknown as string)).toThrow()
})

test('appVariantFromString throws on invalid variant string', () => {
    expect(() => appVariantFromString('invalid_variant')).toThrow()
})

test('appVariantFromString recognizes farm', () => {
    expect(appVariantFromString('farm')).toBe(AppVariant.Farm)
})

test('appVariantFromString recognizes registry', () => {
    expect(appVariantFromString('registry')).toBe(AppVariant.Registry)
})

test('optAppVariantFromString returns undefined on undefined', () => {
    expect(optAppVariantFromString(undefined)).toBe(undefined)
})

test('optAppVariantFromString returns null on null', () => {
    expect(optAppVariantFromString(null)).toBe(null)
})

test('optAppVariantFromString returns null on invalid variant string', () => {
    expect(() => optAppVariantFromString('invalid_variant')).toThrow()
})

test('optAppVariantFromString recognizes farm', () => {
    expect(optAppVariantFromString('farm')).toBe(AppVariant.Farm)
})

test('optAppVariantFromString recognizes registry', () => {
    expect(optAppVariantFromString('registry')).toBe(AppVariant.Registry)
})
