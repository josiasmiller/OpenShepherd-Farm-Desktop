import {Database} from "@database/async";

//region Database Versioning

////////////////////////////////////////////////////////////////////////
// Database Versioning
////////////////////////////////////////////////////////////////////////

/**
 * Representation of the major, minor,
 * and patch version numbers of an
 * AnimalTrakker database.
 */
export class DatabaseVersion {
  constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly patch: number
  ) {}

  isSameAs(other: DatabaseVersion): boolean {
    return this.major === other.major &&
      this.minor === other.minor &&
      this.patch === other.patch;
  }

  isLowerThan(other: DatabaseVersion): boolean {
    return this.major < other.major ||
      (this.major === other.major && this.minor < other.minor) ||
      (this.major === other.major && this.minor === other.minor && this.patch < other.patch);
  }

  asVersionString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
}

export const DB_VERSION_6_0_0 = new DatabaseVersion(6, 0, 0);
export const DB_VERSION_6_1_0 = new DatabaseVersion(6, 1, 0);

export const KNOWN_DB_VERSIONS = [
  DB_VERSION_6_0_0, DB_VERSION_6_1_0
]

export const DB_VERSION_MINIMUM_SUPPORTED = DB_VERSION_6_0_0;
export const DB_VERSION_TARGET = DB_VERSION_6_1_0;

export type ForeignKeyViolation = {
  table: string,
  rowId: number,
  parent: string,
  fkId: number
}

/**
 * Parses a version string into a DatabaseVersion object.
 *
 * @param versionString
 * @returns A DatabaseVersion object with major, minor, and patch versions applied.  Returns
 * null if the versionString is not of the form 'major#.minor#.patch#'.
 */
export const dbVersionFrom = (versionString: string | null): DatabaseVersion | null => {
  if (versionString == null) { return null; }
  const splits = versionString.split('.');
  const major = (0 < splits.length && splits[0] != null && splits[0] !== '') ? Number(splits[0]) : null;
  const minor = (1 < splits.length && splits[1] != null && splits[1] !== '') ? Number(splits[1]) : null;
  const patch = (2 < splits.length && splits[2] != null && splits[2] !== '') ? Number(splits[2]) : null;
  //The following if handles whether major, minor, or patch are NaN by the fact that
  //relational operators always resolve to false when dealing with any NaN value.
  if (major != null && 0 <= major && minor != null && 0 <= minor && patch != null && 0 <= patch) {
    return new DatabaseVersion(major, minor, patch);
  }
  return null;
}

/**
 * Queries the given database for its AnimalTrakker database version string.
 * @param db
 * @returns The version string if found, null if not.
 */
export const queryDBVersion = async (db: Database): Promise<string | null> => {
  type DbVersionResult = { database_version: string } | undefined;
  const queryResult = await db.get<DbVersionResult>(QUERY_DATABASE_VERSION_METADATA).catch(() => null)
      ?? await db.get<DbVersionResult>(QUERY_DATABASE_VERSION_LEGACY).catch(() => null)
      ?? null;
  return queryResult?.database_version ?? null;
}

const QUERY_DATABASE_VERSION_LEGACY = `SELECT database_version FROM animaltrakker_metadata_table LIMIT 1`;
const QUERY_DATABASE_VERSION_METADATA = `SELECT propery_value AS database_version FROM metadata_table WHERE propery_name = 'database_version' LIMIT 1`;

//endregion

//region Known Entity IDs

////////////////////////////////////////////////////////////////////////
// Known Entity IDs
////////////////////////////////////////////////////////////////////////

// genetic_characteristic_table
export const CHARACTERISTIC_COAT_COLOR = "0972486b-7b99-427e-b942-fa5ec88c2678";

// registration_type_table
export const REGISTRATION_TYPE_REGISTERED = "b434cd2d-93da-43d7-a930-7984abfa1788";

// service_type_table
export const ARTIFICIAL_INSEMINATION_FROZEN_LAPROSCOPIC = 'aa46e122-cc6e-4468-b177-93cb117d24c6';
export const ARTIFICIAL_INSEMINATION_FROZEN_VAGINAL = 'f513a321-120b-4b71-af4c-6f6c818ffe19';

// animaltrakker_default_settings_table
export const ID_DEFAULT_SETTINGS_STANDARD = "29753af4-2b46-49b3-854c-4644d8919db6";

//endregion