import {
  checkDBVersion,
  DB_VERSION_CHECK_MIGRATION_OPTIONAL,
  DB_VERSION_CHECK_MIGRATION_REQUIRED,
  DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
  DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT,
  DB_VERSION_CHECK_RESULT_TYPE_PASSED,
  DB_VERSION_CHECK_UNSUPPORTED_VERSION,
} from "./checkDBVersion";

import {DatabaseVersion, dbVersionFrom} from "../../packages/database/schema";

const REQUIRED_DB_VERSION = new DatabaseVersion(1, 2, 3);

const REQUIRED_DB_VERSION_MAJOR = REQUIRED_DB_VERSION.major;
const REQUIRED_DB_VERSION_MINOR = REQUIRED_DB_VERSION.minor;
const REQUIRED_DB_VERSION_PATCH = REQUIRED_DB_VERSION.patch;

const versionStringWrongMajor = `${REQUIRED_DB_VERSION_MAJOR + 1}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH}`;
const versionStringWrongMinor = `${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR + 1}.${REQUIRED_DB_VERSION_PATCH}`;
const versionStringWrongPatch = `${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH + 1}`;

const versionWrongMajor = dbVersionFrom(versionStringWrongMajor)!;
const versionWrongMinor = dbVersionFrom(versionStringWrongMinor)!;
const versionWrongPatch = dbVersionFrom(versionStringWrongPatch)!;

test('checkDBVersion returns DBVersionCheckPassed when given required version', () => {
  const dbVersionString = `${REQUIRED_DB_VERSION_MAJOR}.${REQUIRED_DB_VERSION_MINOR}.${REQUIRED_DB_VERSION_PATCH}`;
  expect(checkDBVersion(dbVersionString, REQUIRED_DB_VERSION))
    .toEqual(expect.objectContaining({ type: DB_VERSION_CHECK_RESULT_TYPE_PASSED }));
})

test('checkDBVersion returns DBVersionCheckInvalidFormat when given jumbled version or null', () => {
  const expectedResult = { type: DB_VERSION_CHECK_RESULT_TYPE_INVALID_FORMAT };
  expect(checkDBVersion('1.1')).toEqual(expect.objectContaining(expectedResult));
  expect(checkDBVersion('a.b.c')).toEqual(expect.objectContaining(expectedResult));
  expect(checkDBVersion('blarg')).toEqual(expect.objectContaining(expectedResult));
  expect(checkDBVersion('a.0.0')).toEqual(expect.objectContaining(expectedResult));
  expect(checkDBVersion('0.b.0')).toEqual(expect.objectContaining(expectedResult));
  expect(checkDBVersion('0.0.c')).toEqual(expect.objectContaining(expectedResult));
})

test('checkDBVersion returns DBVersionCheckUnsupportedVersion when given invalid major or minor versions and no migrations are available', () => {

  const hasMigrationsCheck = (_: DatabaseVersion) => false;

  const expectedResultWrongMajor = {
    type: DB_VERSION_CHECK_UNSUPPORTED_VERSION,
    dbVersion: versionWrongMajor,
    requiredVersion: REQUIRED_DB_VERSION
  };
  expect(checkDBVersion(versionStringWrongMajor, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining(expectedResultWrongMajor));

  const expectedResultWrongMinor = {
    type: DB_VERSION_CHECK_UNSUPPORTED_VERSION,
    dbVersion: versionWrongMinor,
    requiredVersion: REQUIRED_DB_VERSION
  };
  expect(checkDBVersion(versionStringWrongMinor, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining(expectedResultWrongMinor));
})

test('checkDBVersion returns DBVersionCheckMigrationRequired when given invalid major or minor versions and migrations are available', () => {

  const hasMigrationsCheck = (_: DatabaseVersion) => true;

  const expectedResultWrongMajor = {
    type: DB_VERSION_CHECK_MIGRATION_REQUIRED,
    dbVersion: versionWrongMajor,
    targetVersion: REQUIRED_DB_VERSION
  };
  expect(checkDBVersion(versionStringWrongMajor, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining(expectedResultWrongMajor));

  const expectedResultWrongMinor = {
    type: DB_VERSION_CHECK_MIGRATION_REQUIRED,
    dbVersion: versionWrongMinor,
    targetVersion: REQUIRED_DB_VERSION
  };
  expect(checkDBVersion(versionStringWrongMinor, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining(expectedResultWrongMinor));
})

test('checkDBVersion return DBVersionCheckPatchVersionRecommended when given a version with a different patch version than expected and no migrations are available', () => {
  const hasMigrationsCheck = (_: DatabaseVersion) => false;
  expect(checkDBVersion(versionStringWrongPatch, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining({
      type: DB_VERSION_CHECK_PATCH_VERSION_RECOMMENDED,
      dbVersion: versionWrongPatch,
      recommendedVersion: REQUIRED_DB_VERSION
    }));
})

test('checkDBVersion return DBVersionCheckMigrationOptional when given a version with a different patch version than expected and migrations are available', () => {
  const hasMigrationsCheck = (_: DatabaseVersion) => true;
  expect(checkDBVersion(versionStringWrongPatch, REQUIRED_DB_VERSION, hasMigrationsCheck))
    .toEqual(expect.objectContaining({
      type: DB_VERSION_CHECK_MIGRATION_OPTIONAL,
      dbVersion: versionWrongPatch,
      targetVersion: REQUIRED_DB_VERSION
    }));
})
