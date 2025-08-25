
export function isUUIDv4(input: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(input);
}

/**
 * increments a birth notify number by 1
 * @param bn Birth Notify string (format BNYYYYYY where `YYYYYY` represents a numeric string)
 * @returns string
 */
export function incrementBNValue(bn: string): string {
  const match = bn.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) throw new Error("Invalid format");

  const prefix = match[1];
  const numberStr = match[2];

  const numberLength = numberStr.length;
  const incrementedNumber = (parseInt(numberStr, 10) + 1).toString().padStart(numberLength, '0');

  return `${prefix}${incrementedNumber}`;
}

/**
 * increments a registration number by 1. includes left-padded zeroes.
 * @param originalRegNum the original registration number to increment
 * @returns incremented registraiton number
 */
export function incrementRegisteredValue(originalRegNum: string): string {
  const length = originalRegNum.length;
  const incremented = (parseInt(originalRegNum, 10) + 1).toString().padStart(length, "0");
  return incremented;
}


