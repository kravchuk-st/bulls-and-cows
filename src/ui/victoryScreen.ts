import { formatDuration } from '../core/formatDuration.js';
import { getLeaderboard, type GameRecord } from '../core/leaderBoard.js';
import { el } from './dom.js';

const renderRow = (record: GameRecord, index: number, current: GameRecord): HTMLElement =>
  el(
    'tr',
    { className: record === current ? 'current' : '' },
    el('td', {}, String(index + 1)),
    el('td', {}, String(record.attempts)),
    el('td', {}, formatDuration(record.timeMs)),
  );

export const renderVictoryScreen = (
  current: GameRecord,
  records: readonly GameRecord[],
  persisted: boolean,
  onNewGame: () => void,
): HTMLElement => {
  const { length, base } = current.config;
  const leaderboard = getLeaderboard(records, current.config);

  return el(
    'section',
    { className: 'victory' },
    el('h1', {}, 'You won!'),
    el('p', {}, `Attempts: ${current.attempts}. Time: ${formatDuration(current.timeMs)}`),
    persisted ? '' : el('p', { className: 'warning' }, 'Records cannot be saved in this browser.'),
    el('h2', {}, `Leaderboard: ${length} digits, base ${base}`),
    el(
      'table',
      {},
      el('thead', {}, el('tr', {}, el('th', {}, '#'), el('th', {}, 'Attempts'), el('th', {}, 'Time'))),
      el('tbody', {}, ...leaderboard.map((record, index) => renderRow(record, index, current))),
    ),
    el('button', { type: 'button', onclick: onNewGame }, 'New game'),
  );
};
