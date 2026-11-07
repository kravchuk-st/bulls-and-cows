export type Base = 2 | 8 | 10 | 16;

const ALPHABET = '0123456789abcdef';

export const createDigitValidator = (base: Base): ((char: string) => boolean) => {
  const allowed = ALPHABET.slice(0, base);
  return (char) => char.length === 1 && allowed.includes(char.toLowerCase());
};
