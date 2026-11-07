import type { Base } from './createDigitValidator.js';

export const generateSecret = (length: number, base: Base, random: () => number = Math.random): string => {
  void length;
  void base;
  void random;
  return '';
};
