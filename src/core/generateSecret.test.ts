import { describe, expect, it } from 'vitest';
import type { Base } from './createDigitValidator.js';
import { generateSecret } from './generateSecret.js';
import { isValidGuess } from './isValidGuess.js';

const sequence = (values: readonly number[]): (() => number) => {
  let index = 0;
  return () => values[index++ % values.length] as number;
};

describe('generateSecret', () => {
  it('picks the first available digit each time when random always returns 0', () => {
    expect(generateSecret(4, 10, () => 0)).toBe('0123');
  });

  it('picks the last available digit each time when random is close to 1', () => {
    expect(generateSecret(4, 10, () => 0.999)).toBe('9876');
  });

  it('follows the given random sequence and removes used digits from the pool', () => {
    expect(generateSecret(3, 10, sequence([0.5, 0, 0.9]))).toBe('509');
  });

  it('is repeatable for the same random source', () => {
    expect(generateSecret(5, 16, () => 0.3)).toBe(generateSecret(5, 16, () => 0.3));
  });

  it('uses lowercase hex digits', () => {
    expect(generateSecret(2, 16, () => 0.999)).toBe('fe');
  });

  it('allows a leading zero', () => {
    expect(generateSecret(2, 10, () => 0).startsWith('0')).toBe(true);
  });

  it('generates a valid secret for every length and base using the default random', () => {
    const bases: Base[] = [2, 8, 10, 16];
    const lengths = [2, 3, 4, 5, 6];

    bases.forEach((base) =>
      lengths
        .filter((length) => length <= base)
        .forEach((length) => {
          expect(isValidGuess(generateSecret(length, base), length, base)).toBe(true);
        }),
    );
  });
});
