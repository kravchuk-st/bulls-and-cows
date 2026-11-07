export interface GuessResult {
  readonly bulls: number;
  readonly cows: number;
}

const toDigits = (value: string): string[] => [...value.toLowerCase()];

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretDigits = toDigits(secret);
  const guessDigits = toDigits(guess);

  const bulls = guessDigits.filter((digit, index) => digit === secretDigits[index]).length;
  const common = guessDigits.filter((digit) => secretDigits.includes(digit)).length;

  return { bulls, cows: common - bulls };
};
