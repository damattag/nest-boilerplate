export function isValidObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !!Object.keys(obj).length;
}
