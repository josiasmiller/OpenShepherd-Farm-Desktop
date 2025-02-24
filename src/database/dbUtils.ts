
/* escapes characters for DB strings */
function escapeLikeString(str: string): string {
  return str.replace(/[%_]/g, '\\$&');
}