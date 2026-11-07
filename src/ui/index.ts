import { formatDuration } from '../core/formatDuration.js';
import { generateSecret } from '../core/generateSecret.js';
import { startGame, type GameConfig } from '../core/gameState.js';
import { el } from './dom.js';
import { renderGameScreen } from './gameScreen.js';
import { renderSettingsScreen } from './settingsScreen.js';

const app = el('main', { id: 'app' });
document.body.append(app);

const showSettings = (): void => {
  app.replaceChildren(renderSettingsScreen(startNewGame));
};

const startNewGame = (config: GameConfig): void => {
  const state = startGame(config, generateSecret(config.length, config.base));

  app.replaceChildren(
    renderGameScreen(state, {
      onWin: (won, timeMs) =>
        app.replaceChildren(
          el('p', {}, `You won in ${won.attempts.length} attempts, ${formatDuration(timeMs)}`),
          el('button', { type: 'button', onclick: showSettings }, 'New game'),
        ),
      onNewGame: showSettings,
    }),
  );
};

showSettings();
