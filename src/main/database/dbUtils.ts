import {Database} from "sqlite3";

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

/**
 * gets a string representation of a date 
 * @param date 
 * @returns 
 */
export function dateAsString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Returns a date + time in YYYY-MM-DD HH:MM:SS
export function dateTimeAsString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}




// =======================
// | TRANSACTION HELPERS |
// =======================

function runAsync(db: Database, sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function beginTransaction(db: Database): Promise<void> {
  await runAsync(db, 'BEGIN TRANSACTION');
}

export async function commitTransaction(db: Database): Promise<void> {
  await runAsync(db, 'COMMIT');
}

export async function rollbackTransaction(db: Database): Promise<void> {
  await runAsync(db, 'ROLLBACK');
}
