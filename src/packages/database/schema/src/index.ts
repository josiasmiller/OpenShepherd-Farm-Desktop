
export {
  DatabaseVersion,
  queryDBVersion,
  dbVersionFrom,
  DB_VERSION_TARGET
} from './versioning';

export {type ForeignKeyViolation} from './types';

export {
  migrate,
  canMigrateFrom,
  DB_MIGRATION_RESULT_SUCCESS,
  DB_MIGRATION_RESULT_ERROR,
  DB_MIGRATION_RESULT_SKIPPED,
  DB_MIGRATION_RESULT_FK_VIOLATIONS
} from './migration';

export {
  CHARACTERISTIC_COAT_COLOR,
  REGISTRATION_TYPE_REGISTERED,
  ARTIFICIAL_INSEMINATION_FROZEN_LAPROSCOPIC,
  ARTIFICIAL_INSEMINATION_FROZEN_VAGINAL,
  ID_DEFAULT_SETTINGS_STANDARD
} from './schema';
