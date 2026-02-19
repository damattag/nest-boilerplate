import { describe, expect, it } from 'vitest';
import { buildPaginationQuery } from '../build-pagination-query';

describe('buildPaginationQuery', () => {
  it('should return empty object if no input is provided', () => {
    expect(buildPaginationQuery()).toEqual({});
  });

  it('should return take if limit is provided', () => {
    expect(buildPaginationQuery({ limit: 10 })).toEqual({ take: 10 });
  });

  it('should return skip and take if page and limit are provided', () => {
    expect(buildPaginationQuery({ page: 2, limit: 10 })).toEqual({
      take: 10,
      skip: 10,
    });
  });

  it('should return skip 0 for page 1', () => {
    expect(buildPaginationQuery({ page: 1, limit: 10 })).toEqual({
      take: 10,
      skip: 0,
    });
  });
});
