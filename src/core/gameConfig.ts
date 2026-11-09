export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

export const getAvailableLengths = (base: number): number[] =>
  Array.from({ length: Math.min(MAX_LENGTH, base) - MIN_LENGTH + 1 }, (_, index) => MIN_LENGTH + index);
