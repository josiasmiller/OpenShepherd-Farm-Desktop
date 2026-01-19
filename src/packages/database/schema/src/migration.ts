import {Database} from "@database/async";
import {Failure, Result, Success, wrapInError} from "@common/core";
import {type ForeignKeyViolation} from "./types"
import {
  DatabaseVersion,
  DB_VERSION_6_1_0,
  DB_VERSION_TARGET,
  dbVersionFrom,
  queryDBVersion
} from "./versioning";
import {migrateTo6_1_0} from "./migrations/migrateTo6_1_0";

export const DB_MIGRATION_RESULT_SUCCESS = 'db_migration_result_success';
export const DB_MIGRATION_RESULT_ERROR = 'db_migration_result_error';
export const DB_MIGRATION_RESULT_FK_VIOLATIONS = 'db_migration_result_fk_violations';
export const DB_MIGRATION_RESULT_SKIPPED = 'db_migration_result_skipped';

export type DBMigrationResult = DBMigrationSuccess | DBMigrationFailure | DBMigrationSkipped;
export type DBMigrationFailure = DBMigrationError | DBMigrationFKViolations;

export interface DBMigrationSuccess {
  type: typeof DB_MIGRATION_RESULT_SUCCESS,
  oldVersion: DatabaseVersion,
  newVersion: DatabaseVersion
}

export interface DBMigrationError {
  type: typeof DB_MIGRATION_RESULT_ERROR,
  message: string,
  error: Error | null
}

export interface DBMigrationFKViolations {
  type: typeof DB_MIGRATION_RESULT_FK_VIOLATIONS,
  message: string,
  violations: ForeignKeyViolation[]
}

export interface DBMigrationSkipped {
  type: typeof DB_MIGRATION_RESULT_SKIPPED,
  message: string
}

type DBMigrationSpec = {
  version: DatabaseVersion,
  migration: (db: Database) => Promise<void>
};

const MIGRATION_SPECS: DBMigrationSpec[] = [
  { version: DB_VERSION_6_1_0, migration: migrateTo6_1_0 }
  /* ADD FUTURE MIGRATION FUNCTION REFERENCES HERE */
];

export const canMigrateFrom = (dbVersion: DatabaseVersion): boolean => {
  const migrations = migrationsFrom(dbVersion);
  return 0 < migrations.length;
}

export const migrate = async (db: Database): Promise<DBMigrationResult> => {

  try {

    const currentVersion = dbVersionFrom(await queryDBVersion(db));

    if (!currentVersion) {
      return {
        type: DB_MIGRATION_RESULT_ERROR,
        message: "Unable to determine database current version prior to migration.",
        error: null
      };
    }

    if (DB_VERSION_TARGET.isSameAs(currentVersion)) {
      return {
        type: DB_MIGRATION_RESULT_SKIPPED,
        message: `Database is already migrated to version '${DB_VERSION_TARGET.asVersionString()}'.`
      };
    }

    if (DB_VERSION_TARGET.isLowerThan(currentVersion)) {
      return {
        type: DB_MIGRATION_RESULT_ERROR,
        message: `Database is already migrated to version '${currentVersion.asVersionString()}' past required version ${DB_VERSION_TARGET.asVersionString()}'.`,
        error: null
      }
    }

    const migrations: DBMigrationSpec[] = migrationsFrom(currentVersion);

    if (migrations.length === 0) {
      return {
        type: DB_MIGRATION_RESULT_ERROR,
        message: `No migrations found for database version '${currentVersion.asVersionString()}'}.`,
        error: null
      };
    }

    const preMigrationFKViolations = await db.all<ForeignKeyViolation>(`PRAGMA FOREIGN_KEY_CHECK`);

    if (preMigrationFKViolations.length !== 0) {
      return {
        type: DB_MIGRATION_RESULT_FK_VIOLATIONS,
        message: `Foreign key violations detected before the migration.`,
        violations: preMigrationFKViolations
      };
    }

    try {

      //FOREIGN_KEYS COMMANDS MUST TAKE PLACE ***OUTSIDE*** OF THE
      //TRANSACTION AS SQLITE IGNORES THEM IF INSIDE A TRANSACTION.
      await db.exec(`PRAGMA FOREIGN_KEYS = 0`)

      const transactionResult = await db.inTransactionForResult(async (db: Database): Promise<Result<DBMigrationSuccess, DBMigrationFailure>> => {

        for (const spec of migrations) {
          await spec.migration(db);
        }

        const migratedVersion = dbVersionFrom(await queryDBVersion(db));

        if (!migratedVersion) {
          return new Failure({
            type: DB_MIGRATION_RESULT_ERROR,
            message: `Unable to determine database version following migration.`,
            error: null
          });
        }

        if (!DB_VERSION_TARGET.isSameAs(migratedVersion)) {
          return new Failure({
            type: DB_MIGRATION_RESULT_ERROR,
            message: `Database migration failed to achieve target version '${DB_VERSION_TARGET.asVersionString()}'.`,
            error: null
          });
        }

        const postMigrationFKViolations = await db.all<ForeignKeyViolation>(`PRAGMA FOREIGN_KEY_CHECK`)

        if (postMigrationFKViolations.length !== 0) {
          return new Failure({
            type: DB_MIGRATION_RESULT_FK_VIOLATIONS,
            message: `Foreign key violations occurred as part of the migration.`,
            violations: postMigrationFKViolations
          });
        }

        return new Success({
          type: DB_MIGRATION_RESULT_SUCCESS,
          oldVersion: currentVersion,
          newVersion: migratedVersion
        });
      });

      switch(transactionResult.tag) {
        case "success":
          return transactionResult.data;
        case "error":
          return transactionResult.error
      }

    } finally {
      await db.exec(`PRAGMA FOREIGN_KEYS = 1`)
    }

  } catch (error) {
    return {
      type: DB_MIGRATION_RESULT_ERROR,
      message: `Database Migration failed with an error.`,
      error: wrapInError(error)
    };
  }
}

const migrationsFrom = (dbVersion: DatabaseVersion): DBMigrationSpec[] => {
  return MIGRATION_SPECS.filter((spec) => {
    return dbVersion.isLowerThan(spec.version);
  });
}
