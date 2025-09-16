import { readFileSync } from "fs";
import * as semver from "semver";

/**
 * Reads and validates a semantic version string from a file.
 * @param filePath Path to the file containing the version string.
 * @returns The validated semantic version string.
 * @throws If the file cannot be read or the version is invalid.
 */
export function readAndValidateSemver(filePath: string): string {
  // Read file contents
  const content = readFileSync(filePath, "utf8").trim();

  // Validate with semver
  if (!semver.valid(content)) {
    throw new Error(`Invalid semantic version string: "${content}" in file ${filePath}`);
  }

  return content;
}
