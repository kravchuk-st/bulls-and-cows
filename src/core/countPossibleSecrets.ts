const memoize = <Args extends unknown[], Result>(fn: (...args: Args) => Result): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();

  return (...args) => {
    const key = args.join(':');
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key) as Result;
  };
};

export const countPossibleSecrets: (length: number, base: number) => number = memoize(
  (length: number, base: number): number => {
    if (length > base) {
      return 0;
    }
    if (length === 0) {
      return 1;
    }
    return base * countPossibleSecrets(length - 1, base - 1);
  },
);
