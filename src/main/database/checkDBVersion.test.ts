import {
  checkDBVersion,
  DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT,
  DB_VERSION_CHECK_RESULT_TYPE_PASSED,
  DB_VERSION_CHECK_UNSUPPORTED_VERSION,
  dbVersionFrom,
  REQUIRED_DB_VERSION_MAJOR,
  REQUIRED_DB_VERSION_MINOR,
  REQUIRED_DB_VERSION_PATCH
} from "./checkDBVersion";

test('dbVersionFrom returns null when passed null or undefined', () => {
  expect(dbVersionFrom(undefined)).toBeNull()
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

test('checkDBVersion returns DBVersionCheckPassed when given required version', () => {
  expect(checkDBVersion(`${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH}`))
    .toEqual(expect.objectContaining({ type: DB_VERSION_CHECK_RESULT_TYPE_PASSED }))
})

test('checkDBVersion returns DBVersionCheckInvalidFormat when given jumbled version or null', () => {
  const expectedResult = { type: DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT }
  expect(checkDBVersion('1.1')).toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion('a.b.c')).toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion('blarg')).toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion('a.0.0')).toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion('0.b.0')).toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion('0.0.c')).toEqual(expect.objectContaining(expectedResult))
})

test('checkDBVersion returns DBVersionCheckUnsupportedVersion when given invalid major or minor versions', () => {
  const expectedResult = { type: DB_VERSION_CHECK_UNSUPPORTED_VERSION }
  expect(checkDBVersion(`${REQUIRED_DB_VERSION_MAJOR + 1}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH}`))
    .toEqual(expect.objectContaining(expectedResult))
  expect(checkDBVersion(`${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR + 1}.${REQUIRED_DB_VERSION_PATCH}`))
    .toEqual(expect.objectContaining(expectedResult))
})

test('checkDBVersion return DBVersionCheckPatchVersionRecommended when given a version with a different patch version than expected', () => {
  expect(checkDBVersion(`${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH + 1}`))
    .toEqual(expect.objectContaining({ type: DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED }))
})
