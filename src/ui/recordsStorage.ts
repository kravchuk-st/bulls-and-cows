import { addRecord, parseRecords, type GameRecord } from '../core/leaderBoard.js';

const STORAGE_KEY = 'bulls-and-cows:records';

export interface SaveResult {
  readonly records: GameRecord[];
  readonly persisted: boolean;
}

export const loadRecords = (): GameRecord[] => {
  try {
    return parseRecords(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
};

export const saveRecord = (record: GameRecord): SaveResult => {
  const records = addRecord(loadRecords(), record);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return { records, persisted: true };
  } catch {
    return { records, persisted: false };
  }
};
