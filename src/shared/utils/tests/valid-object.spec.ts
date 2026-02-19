import { describe, expect, it } from 'vitest';
import { isValidObject } from '../valid-object';

describe('isValidObject function', () => {
  it('should return true for a valid non-empty object', () => {
    expect(isValidObject({ key: 'value' })).toBe(true);
  });

  it('should return false for an empty object', () => {
    expect(isValidObject({})).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isValidObject(undefined)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isValidObject('string')).toBe(false);
    expect(isValidObject(123)).toBe(false);
    expect(isValidObject(true)).toBe(false);
  });
});
