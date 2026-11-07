import { describe, expect, it } from 'vitest';
import type { GameConfig } from './gameState.js';
import { addRecord, getLeaderboard, parseRecords, type GameRecord } from './leaderBoard.js';

const decimal4: GameConfig = { length: 4, base: 10 };
const hex5: GameConfig = { length: 5, base: 16 };

const makeRecord = (attempts: number, timeMs: number, config: GameConfig = decimal4): GameRecord => ({
  config,
  attempts,
  timeMs,
});

describe('addRecord', () => {
  it('appends the record to the end', () => {
    const first = makeRecord(5, 1000);
    const second = makeRecord(3, 2000);

    expect(addRecord([first], second)).toEqual([first, second]);
  });

  it('does not mutate the original list', () => {
    const records = Object.freeze([makeRecord(5, 1000)]);

    expect(addRecord(records, makeRecord(3, 2000))).not.toBe(records);
    expect(records).toHaveLength(1);
  });
});

describe('getLeaderboard', () => {
  it('returns an empty list when there are no records', () => {
    expect(getLeaderboard([], decimal4)).toEqual([]);
  });

  it('keeps only records with the same length and base', () => {
    const matching = makeRecord(4, 1000);
    const otherBase = makeRecord(2, 500, hex5);
    const otherLength = makeRecord(2, 500, { length: 3, base: 10 });

    expect(getLeaderboard([matching, otherBase, otherLength], decimal4)).toEqual([matching]);
  });

  it('sorts by attempts first and by time second', () => {
    const slowFewAttempts = makeRecord(3, 9000);
    const fastFewAttempts = makeRecord(3, 4000);
    const fastManyAttempts = makeRecord(7, 1000);

    expect(getLeaderboard([fastManyAttempts, slowFewAttempts, fastFewAttempts], decimal4)).toEqual([
      fastFewAttempts,
      slowFewAttempts,
      fastManyAttempts,
    ]);
  });

  it('keeps the older record first when attempts and time are equal', () => {
    const older = makeRecord(4, 1000);
    const newer = makeRecord(4, 1000);
    const result = getLeaderboard([older, newer], decimal4);

    expect(result[0]).toBe(older);
    expect(result[1]).toBe(newer);
  });

  it('limits the number of records, 10 by default', () => {
    const records = Array.from({ length: 12 }, (_, index) => makeRecord(index + 1, 1000));

    expect(getLeaderboard(records, decimal4)).toHaveLength(10);
    expect(getLeaderboard(records, decimal4, 3).map((record) => record.attempts)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original list', () => {
    const records = Object.freeze([makeRecord(9, 1000), makeRecord(1, 1000)]);

    getLeaderboard(records, decimal4);

    expect(records.map((record) => record.attempts)).toEqual([9, 1]);
  });
});

describe('parseRecords', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(parseRecords(null)).toEqual([]);
  });

  it('parses a stored list of records', () => {
    const records = [makeRecord(5, 1000), makeRecord(3, 2000, hex5)];

    expect(parseRecords(JSON.stringify(records))).toEqual(records);
  });

  it('returns an empty list for invalid JSON', () => {
    expect(parseRecords('{not json')).toEqual([]);
  });

  it('returns an empty list when the stored value is not an array', () => {
    expect(parseRecords('{"attempts":5}')).toEqual([]);
    expect(parseRecords('42')).toEqual([]);
  });

  it('skips malformed entries and keeps valid ones', () => {
    const valid = makeRecord(5, 1000);
    const stored = JSON.stringify([
      valid,
      null,
      { attempts: 5 },
      { config: { length: 4, base: 7 }, attempts: 3, timeMs: 100 },
      { config: decimal4, attempts: -1, timeMs: 100 },
      { config: decimal4, attempts: 3, timeMs: 'fast' },
    ]);

    expect(parseRecords(stored)).toEqual([valid]);
  });
});
