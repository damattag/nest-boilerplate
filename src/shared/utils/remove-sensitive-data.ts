export function removeSensitiveData(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      key.toLowerCase().includes('password') ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('token') ||
      key === 'otp'
    ) {
      newObj[key] = '***';
    } else {
      newObj[key] = value;
    }
  }

  return newObj;
}
