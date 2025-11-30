import {execSync} from 'child_process';

export function readCommitShortSHA(): string {
  try {
    return execSync('git rev-parse --short HEAD')
      .toString('utf-8');
  } catch (err) {
    console.error(`Error reading commit short SHA: ${err}`);
    throw err;
  }
}

export function readCommitFullSHA(): string {
  try {
    return execSync('git rev-parse HEAD')
      .toString('utf-8');
  } catch (err) {
    console.error(`Error reading commit full SHA: ${err}`);
    throw err;
  }
}
