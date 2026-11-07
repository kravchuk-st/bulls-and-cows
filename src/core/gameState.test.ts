import { describe, expect, it } from 'vitest';
import { addAttempt, isWon, startGame, type GameConfig } from './gameState.js';

const config: GameConfig = { length: 4, base: 10 };

describe('startGame', () => {
  it('creates a game with the given config and secret and no attempts', () => {
    expect(startGame(config, '1234')).toEqual({ config, secret: '1234', attempts: [] });
  });
});

describe('addAttempt', () => {
  it('appends an evaluated attempt', () => {
    const next = addAttempt(startGame(config, '1234'), '1243');

    expect(next.attempts).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
  });

  it('keeps previous attempts in order', () => {
    const first = addAttempt(startGame(config, '1234'), '5678');
    const second = addAttempt(first, '1567');

    expect(second.attempts.map((attempt) => attempt.guess)).toEqual(['5678', '1567']);
  });

  it('does not mutate the previous state', () => {
    const state = startGame(config, '1234');
    const next = addAttempt(state, '5678');

    expect(next).not.toBe(state);
    expect(state.attempts).toEqual([]);
  });

  it('returns the same state for an invalid guess', () => {
    const state = startGame(config, '1234');

    expect(addAttempt(state, '12')).toBe(state);
    expect(addAttempt(state, '1123')).toBe(state);
    expect(addAttempt(state, '12ab')).toBe(state);
  });

  it('stores the guess in lowercase', () => {
    const hexState = startGame({ length: 4, base: 16 }, 'ab3f');

    expect(addAttempt(hexState, 'AB3F').attempts[0]?.guess).toBe('ab3f');
  });

  it('ignores attempts after the game is won', () => {
    const won = addAttempt(startGame(config, '1234'), '1234');

    expect(addAttempt(won, '5678')).toBe(won);
  });
});

describe('isWon', () => {
  it('is false before any attempt', () => {
    expect(isWon(startGame(config, '1234'))).toBe(false);
  });

  it('is false while the last attempt is not all bulls', () => {
    expect(isWon(addAttempt(startGame(config, '1234'), '1243'))).toBe(false);
  });

  it('is true when the last attempt is all bulls', () => {
    expect(isWon(addAttempt(startGame(config, '1234'), '1234'))).toBe(true);
  });
});
