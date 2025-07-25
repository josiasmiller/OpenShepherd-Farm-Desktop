import { getDatabase } from './dbConnections.js';

export function escapeLikeString(str: string): string {
  return str.replace(/[%_]/g, '\\$&');
}

export function getDbDate(input: string): Date | null {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(input)) {
    console.error(`Invalid date format: ${input}. Expected format: YYYY-MM-DD.`);
    return null;
  }

  const [yearStr, monthStr, dayStr] = input.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    console.error(`Invalid date components: ${input}`);
    return null;
  }

  return date;
}

export function getSQLiteDateStringNow(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}


// =======================
// | TRANSACTION HELPERS |
// =======================

function runAsync(sql: string): Promise<void> {
  const db = getDatabase();
  if (!db) throw new Error("Database not initialized");
  return new Promise((resolve, reject) => {
    db.run(sql, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function beginTransaction(): Promise<void> {
  await runAsync('BEGIN TRANSACTION');
}

export async function commitTransaction(): Promise<void> {
  await runAsync('COMMIT');
}

export async function rollbackTransaction(): Promise<void> {
  await runAsync('ROLLBACK');
}
