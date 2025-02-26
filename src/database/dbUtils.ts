
/* escapes characters for DB strings */
export function escapeLikeString(str: string): string {
  return str.replace(/[%_]/g, '\\$&');
}