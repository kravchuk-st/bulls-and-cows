import type { Base } from './createDigitValidator.js';
import type { GuessResult } from './evaluateGuess.js';

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

export const startGame = (config: GameConfig, secret: string): GameState => {
  void secret;
  return { config, secret: '', attempts: [] };
};

export const addAttempt = (state: GameState, guess: string): GameState => {
  void guess;
  return state;
};

export const isWon = (state: GameState): boolean => {
  void state;
  return false;
};
