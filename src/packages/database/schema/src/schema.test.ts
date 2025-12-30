import {dbVersionFrom} from "./schema";

test('dbVersionFrom returns null when passed null', () => {
    expect(dbVersionFrom(null)).toBeNull()
})

test('dbVersionFrom returns null when version format is invalid', () => {

    //Non-numeric version numbers
    expect(dbVersionFrom('a.0.0')).toBeNull()
    expect(dbVersionFrom('0.b.0')).toBeNull()
    expect(dbVersionFrom('0.0.c')).toBeNull()

    //Negative version numbers
    expect(dbVersionFrom('-1.0.0')).toBeNull()
    expect(dbVersionFrom('0.-1.0')).toBeNull()
    expect(dbVersionFrom('0.0.-1')).toBeNull()

    //Incomplete major.minor.patch formatting
    expect(dbVersionFrom('')).toBeNull()
    expect(dbVersionFrom('1.0')).toBeNull()
    expect(dbVersionFrom('1..0.0')).toBeNull()
    expect(dbVersionFrom('1.0..0')).toBeNull()
    expect(dbVersionFrom('non-version-string')).toBeNull()
})

test('dbVersionFrom returns DatabaseVersion when version string is valid', () => {
    expect(dbVersionFrom('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
    expect(dbVersionFrom('0.0.1')).toEqual({ major: 0, minor: 0, patch: 1 })
    expect(dbVersionFrom('0.1.0')).toEqual({ major: 0, minor: 1, patch: 0 })
    expect(dbVersionFrom('0.1.1')).toEqual({ major: 0, minor: 1, patch: 1 })
    expect(dbVersionFrom('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0 })
    expect(dbVersionFrom('1.0.1')).toEqual({ major: 1, minor: 0, patch: 1 })
    expect(dbVersionFrom('1.1.0')).toEqual({ major: 1, minor: 1, patch: 0 })
    expect(dbVersionFrom('1.1.1')).toEqual({ major: 1, minor: 1, patch: 1 })
})
