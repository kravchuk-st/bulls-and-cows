export type Base = 2 | 8 | 10 | 16;

export const createDigitValidator = (base: Base): ((char: string) => boolean) => {
  void base;
  return () => false;
};
