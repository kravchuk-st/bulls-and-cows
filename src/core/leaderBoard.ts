import type { GameConfig } from './gameState.js';
import { MIN_LENGTH } from './gameConfig.js';

export interface GameRecord {
  readonly config: GameConfig;
  readonly attempts: number;
  readonly timeMs: number;
}

const SUPPORTED_BASES: readonly number[] = [2, 8, 10, 16];

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isInteger = (value: unknown): value is number => Number.isInteger(value);

const isGameRecord = (value: unknown): value is GameRecord => {
  if (!isObject(value)) {
    return false;
  }

  const { config, attempts, timeMs } = value;

  return (
    isObject(config) &&
    isInteger(config.length) &&
    config.length >= MIN_LENGTH &&
    isInteger(config.base) &&
    SUPPORTED_BASES.includes(config.base) &&
    isInteger(attempts) &&
    attempts > 0 &&
    typeof timeMs === 'number' &&
    Number.isFinite(timeMs) &&
    timeMs >= 0
  );
};

const hasConfig =
  (config: GameConfig) =>
  (record: GameRecord): boolean =>
    record.config.length === config.length && record.config.base === config.base;

const compareRecords = (a: GameRecord, b: GameRecord): number => a.attempts - b.attempts || a.timeMs - b.timeMs;

export const addRecord = (records: readonly GameRecord[], record: GameRecord): GameRecord[] => [...records, record];

export const getLeaderboard = (records: readonly GameRecord[], config: GameConfig, limit = 10): GameRecord[] =>
  records.filter(hasConfig(config)).sort(compareRecords).slice(0, limit);

export const parseRecords = (json: string | null): GameRecord[] => {
  if (json === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(json);

    return Array.isArray(parsed) ? parsed.filter(isGameRecord) : [];
  } catch {
    return [];
  }
};
