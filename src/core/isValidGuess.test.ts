import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess.js';

describe('isValidGuess', () => {
  it('accepts a guess with the right length and unique valid digits', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
    expect(isValidGuess('01', 2, 2)).toBe(true);
  });

  it('rejects a guess of the wrong length', () => {
    expect(isValidGuess('012', 4, 10)).toBe(false);
    expect(isValidGuess('01234', 4, 10)).toBe(false);
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects characters that are not digits of the base', () => {
    expect(isValidGuess('0123', 4, 2)).toBe(false);
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
    expect(isValidGuess('12 4', 4, 10)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('00', 2, 2)).toBe(false);
  });

  it('accepts hex digits in any case', () => {
    expect(isValidGuess('aB3f', 4, 16)).toBe(true);
    expect(isValidGuess('AB3F', 4, 16)).toBe(true);
  });

  it('treats hex digits that differ only by case as the same digit', () => {
    expect(isValidGuess('aA', 2, 16)).toBe(false);
  });
});
