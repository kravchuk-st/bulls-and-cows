import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';

describe('evaluateGuess', () => {
  it('returns all bulls when the guess equals the secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns zeros when no digits match', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('returns all cows when every digit is present but misplaced', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
    expect(evaluateGuess('1234', '5612')).toEqual({ bulls: 0, cows: 2 });
  });

  it('handles secrets with a leading zero', () => {
    expect(evaluateGuess('0123', '0132')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('0123', '1023')).toEqual({ bulls: 2, cows: 2 });
  });

  it('compares hex digits case-insensitively', () => {
    expect(evaluateGuess('aB3f', 'AB3F')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('ab3f', 'FA3B')).toEqual({ bulls: 1, cows: 3 });
  });

  it('works for the minimal length of 2', () => {
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
  });
});
