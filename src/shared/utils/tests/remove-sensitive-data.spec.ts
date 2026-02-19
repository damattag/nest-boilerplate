import { describe, expect, it } from 'vitest';
import { removeSensitiveData } from '../remove-sensitive-data';

describe('removeSensitiveData', () => {
  it('should obscure password fields', () => {
    const input = {
      name: 'John',
      password: 'secret-password',
      confirmPassword: 'secret-password',
    };

    const result = removeSensitiveData(input);

    expect(result.name).toBe('John');
    expect(result.password).toBe('***');
    expect(result.confirmPassword).toBe('***');
  });

  it('should obscure secret and token fields', () => {
    const input = {
      clientSecret: 'shhh',
      accessToken: 'token123',
    };

    const result = removeSensitiveData(input);

    expect(result.clientSecret).toBe('***');
    expect(result.accessToken).toBe('***');
  });

  it('should obscure otp fields', () => {
    const input = {
      otp: '123456',
    };

    const result = removeSensitiveData(input);

    expect(result.otp).toBe('***');
  });

  it('should not change other fields', () => {
    const input = {
      id: '1',
      email: 'john@example.com',
    };

    const result = removeSensitiveData(input);

    expect(result).toEqual(input);
  });
});
