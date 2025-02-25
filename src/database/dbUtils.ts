
/* escapes characters for DB strings */
export function escapeLikeString(str: string): string {

  console.log("MITCH DEBUG!");
  console.log(str);
  console.log(str.replace(/[%_]/g, '\\$&'));

  return str.replace(/[%_]/g, '\\$&');
}