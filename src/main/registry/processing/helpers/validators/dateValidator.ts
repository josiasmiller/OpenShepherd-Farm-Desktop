import { ValidationResponse } from '@app/api';

export function checkDateFormat(date: string): ValidationResponse {
  const errors: string[] = [];

  // if not provided, exit check early
  if (date === null || date === undefined) {
    errors.push(
      `invalid date: ${date}`
    );
    return { checkName: "checkDateFormat", errors, passed: errors.length === 0 };
  }

  // Regex: YYYY-MM-DD where MM = 01–12 and DD = 01–31
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    errors.push(
      `Invalid date format: expected 'YYYY-MM-DD', got '${date}'.`
    );
  } else {
    // Extra check: verify it's a real calendar date
    const d = new Date(date);
    const [y, m, day] = date.split('-').map(Number);

    const valid =
      d.getUTCFullYear() === y &&
      d.getUTCMonth() + 1 === m &&
      d.getUTCDate() === day;

    if (!valid) {
      errors.push(
        `'${date}' is not a valid calendar date.`
      );
    }
  }

  return { checkName: "checkDateFormat", errors, passed: errors.length === 0 };
}
