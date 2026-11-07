import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';

describe('countPossibleSecrets', () => {
  it('returns 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns the base for length 1', () => {
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('counts permutations for the minimal case', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('counts secrets for decimal digits, including leading zeros', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('counts secrets for octal and hex digits', () => {
    expect(countPossibleSecrets(3, 8)).toBe(336);
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  it('returns 0 when the length exceeds the base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(5, 4)).toBe(0);
  });

  it('returns the same result on repeated calls', () => {
    expect(countPossibleSecrets(5, 10)).toBe(30240);
    expect(countPossibleSecrets(5, 10)).toBe(30240);
  });
});
