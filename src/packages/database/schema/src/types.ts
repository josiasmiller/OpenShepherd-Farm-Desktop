
/**
 * Row data to reify the results
 * of a PRAGMA FOREIGN_KEY_CHECK
 * invocation.
 */
export type ForeignKeyViolation = {
  table: string,
  rowId: number,
  parent: string,
  fkId: number
}
