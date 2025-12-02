
export function formatTimeStamp(dateTime: Date): string {
  const year = String(dateTime.getFullYear()).padStart(4, '0')
  const month = String(dateTime.getMonth() + 1).padStart(2, '0')
  const day = String(dateTime.getDate()).padStart(2, '0')
  const hour = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  const seconds = String(dateTime.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}
