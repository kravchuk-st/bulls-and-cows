import type { GameConfig } from './gameState.js';

export interface GameRecord {
  readonly config: GameConfig;
  readonly attempts: number;
  readonly timeMs: number;
}

export const addRecord = (records: readonly GameRecord[], record: GameRecord): GameRecord[] => {
  void record;
  return [...records];
};

export const getLeaderboard = (records: readonly GameRecord[], config: GameConfig, limit = 10): GameRecord[] => {
  void records;
  void config;
  void limit;
  return [];
};

export const parseRecords = (json: string | null): GameRecord[] => {
  void json;
  return [];
};
