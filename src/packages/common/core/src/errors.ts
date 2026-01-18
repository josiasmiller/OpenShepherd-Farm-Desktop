
export const wrapInError = (original: unknown, alternate?: string): Error => {
  if (original instanceof Error) {
    return original;
  }
  if (typeof original === 'string') {
    return new Error(original);
  }
  return new Error(alternate ?? `Unknown Error`)
}
