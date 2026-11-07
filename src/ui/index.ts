import { generateSecret } from '../core/generateSecret.js';
import { startGame, type GameConfig } from '../core/gameState.js';
import type { GameRecord } from '../core/leaderBoard.js';
import { el } from './dom.js';
import { renderGameScreen } from './gameScreen.js';
import { saveRecord } from './recordsStorage.js';
import { renderSettingsScreen } from './settingsScreen.js';
import { renderVictoryScreen } from './victoryScreen.js';

const app = el('main', { id: 'app' });
document.body.append(app);

const showSettings = (): void => {
  app.replaceChildren(renderSettingsScreen(startNewGame));
};

const startNewGame = (config: GameConfig): void => {
  const state = startGame(config, generateSecret(config.length, config.base));

  app.replaceChildren(
    renderGameScreen(state, {
      onWin: (won, timeMs) => {
        const record: GameRecord = { config: won.config, attempts: won.attempts.length, timeMs };
        const { records, persisted } = saveRecord(record);

        app.replaceChildren(renderVictoryScreen(record, records, persisted, showSettings));
      },
      onNewGame: showSettings,
    }),
  );
};

showSettings();
