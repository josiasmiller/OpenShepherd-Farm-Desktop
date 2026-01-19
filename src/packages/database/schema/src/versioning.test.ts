import {DatabaseVersion, dbVersionFrom} from "./versioning";

describe("dbVersionFrom", () => {

  it('returns null when passed null', () => {
    expect(dbVersionFrom(null)).toBeNull()
  })

  it('returns null when version format is invalid', () => {

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

  it('returns DatabaseVersion when version string is valid', () => {
    expect(dbVersionFrom('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
    expect(dbVersionFrom('0.0.1')).toEqual({ major: 0, minor: 0, patch: 1 })
    expect(dbVersionFrom('0.1.0')).toEqual({ major: 0, minor: 1, patch: 0 })
    expect(dbVersionFrom('0.1.1')).toEqual({ major: 0, minor: 1, patch: 1 })
    expect(dbVersionFrom('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0 })
    expect(dbVersionFrom('1.0.1')).toEqual({ major: 1, minor: 0, patch: 1 })
    expect(dbVersionFrom('1.1.0')).toEqual({ major: 1, minor: 1, patch: 0 })
    expect(dbVersionFrom('1.1.1')).toEqual({ major: 1, minor: 1, patch: 1 })
  })
})

describe('DatabaseVersion', () => {
  describe('sameAs', () => {
    it('returns true when equal to other version', () => {
      const version = new DatabaseVersion(7, 8, 9)
      expect(version.isSameAs(version)).toBe(true)
    })
    it('returns false when not equal to other version', () => {
      const version = new DatabaseVersion(7, 8, 9)
      expect(version.isSameAs(new DatabaseVersion(6, 8, 9))).toBe(false)
      expect(version.isSameAs(new DatabaseVersion(7, 9, 9))).toBe(false)
      expect(version.isSameAs(new DatabaseVersion(7, 8, 10))).toBe(false)
    })
  })
  describe('lessThan', () => {
    it('returns true when less than other version', () => {
      const version = new DatabaseVersion(7, 8, 9)
      expect(version.isLowerThan(new DatabaseVersion(8, 0, 0))).toBe(true)
      expect(version.isLowerThan(new DatabaseVersion(7, 9, 0))).toBe(true)
      expect(version.isLowerThan(new DatabaseVersion(7, 8, 10))).toBe(true)
    })
    it('returns false when greater than other version', () => {
      const version = new DatabaseVersion(7, 8, 9)
      expect(version.isLowerThan(new DatabaseVersion(6, 0, 0))).toBe(false)
      expect(version.isLowerThan(new DatabaseVersion(7, 7, 0))).toBe(false)
      expect(version.isLowerThan(new DatabaseVersion(7, 8, 8))).toBe(false)
    })
    it('returns false when equal to other version', () => {
      const version = new DatabaseVersion(7, 8, 9)
      expect(version.isLowerThan(version)).toBe(false)
    })
  })
})
