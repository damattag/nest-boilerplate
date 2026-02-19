import { describe, expect, it } from 'vitest';
import { buildResponseMeta } from '../build-response-meta';

describe('buildResponseMeta', () => {
  it('should calculate total pages correctly', () => {
    const input = {
      limit: 10,
      listed: 10,
      page: 1,
      total: 25,
    };

    const result = buildResponseMeta(input);

    expect(result.totalPages).toBe(3);
    expect(result.listed).toBe(10);
    expect(result.total).toBe(25);
    expect(result.page).toBe(1);
  });

  it('should return totalPages as 1 if total is 0', () => {
    const input = {
      limit: 10,
      listed: 0,
      page: 1,
      total: 0,
    };

    const result = buildResponseMeta(input);

    expect(result.totalPages).toBe(1);
  });

  it('should return totalPages as 1 if total is less than limit', () => {
    const input = {
      limit: 10,
      listed: 5,
      page: 1,
      total: 5,
    };

    const result = buildResponseMeta(input);

    expect(result.totalPages).toBe(1);
  });
});
