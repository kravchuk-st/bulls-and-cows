import type { Base } from './createDigitValidator.js';
import { evaluateGuess, type GuessResult } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';

export interface GameConfig {
  readonly length: number;
  readonly base: Base;
}

export interface Attempt extends GuessResult {
  readonly guess: string;
}

export interface GameState {
  readonly config: GameConfig;
  readonly secret: string;
  readonly attempts: readonly Attempt[];
}

export const startGame = (config: GameConfig, secret: string): GameState => ({
  config,
  secret,
  attempts: [],
});

export const isWon = (state: GameState): boolean => {
  const lastAttempt = state.attempts.at(-1);

  return lastAttempt !== undefined && lastAttempt.bulls === state.config.length;
};

export const addAttempt = (state: GameState, guess: string): GameState => {
  const { length, base } = state.config;

  if (isWon(state) || !isValidGuess(guess, length, base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();
  const attempt: Attempt = { guess: normalizedGuess, ...evaluateGuess(state.secret, normalizedGuess) };

  return { ...state, attempts: [...state.attempts, attempt] };
};
