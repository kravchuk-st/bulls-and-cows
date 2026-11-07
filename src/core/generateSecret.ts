import type { Base } from './createDigitValidator.js';

const ALPHABET = '0123456789abcdef';

const pickUnique = (pool: readonly string[], count: number, random: () => number): string[] => {
  if (count === 0) {
    return [];
  }

  const index = Math.floor(random() * pool.length);
  const rest = pool.filter((_, position) => position !== index);

  return [pool[index] as string, ...pickUnique(rest, count - 1, random)];
};

export const generateSecret = (length: number, base: Base, random: () => number = Math.random): string =>
  pickUnique([...ALPHABET.slice(0, base)], length, random).join('');
