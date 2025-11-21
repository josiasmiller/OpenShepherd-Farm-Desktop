import fs from "fs/promises";

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

/**
 * Reads a JSON file and returns its contents as `unknown`.
 *
 * This function should NEVER assert a type.
 */
export async function readJsonFile(filePath: string): Promise<any> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}
