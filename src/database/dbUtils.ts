
/* escapes characters for DB strings */
export function escapeLikeString(str: string): string {
  return str.replace(/[%_]/g, '\\$&');
}

// INPUT MUST BE IN `YYYY-MM-DD` FORMAT!
export function getDbDate(input: string): Date | null {
  
  // Validate format: YYYY-MM-DD
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(input)) {
    console.error(`Invalid date format: ${input}. Expected format: YYYY-MM-DD.`);
    return null;
  }

  const [yearStr, monthStr, dayStr] = input.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Create date in UTC to avoid timezone issues
  const date = new Date(Date.UTC(year, month - 1, day));

  // Check for invalid date
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
