import { getDatabase } from './dbConnections';

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

// Returns today's date in YYYY-MM-DD
export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Returns current date + time in YYYY-MM-DD HH:MM:SS
export function getCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
