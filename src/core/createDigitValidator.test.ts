import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './createDigitValidator.js';

describe('createDigitValidator', () => {
  it('accepts only 0 and 1 for base 2', () => {
    const isDigit = createDigitValidator(2);
    expect(isDigit('0')).toBe(true);
    expect(isDigit('1')).toBe(true);
    expect(isDigit('2')).toBe(false);
  });

  it('accepts 0-7 for base 8', () => {
    const isDigit = createDigitValidator(8);
    expect(isDigit('7')).toBe(true);
    expect(isDigit('8')).toBe(false);
  });

  it('accepts 0-9 for base 10 and rejects letters', () => {
    const isDigit = createDigitValidator(10);
    expect(isDigit('9')).toBe(true);
    expect(isDigit('a')).toBe(false);
  });

  it('accepts 0-9 and a-f for base 16, case-insensitive', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('a')).toBe(true);
    expect(isDigit('A')).toBe(true);
    expect(isDigit('f')).toBe(true);
    expect(isDigit('g')).toBe(false);
  });

  it('rejects empty strings and multi-char input', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('')).toBe(false);
    expect(isDigit('ab')).toBe(false);
  });
});
