import { generateSecret } from '../core/generateSecret.js';
import { startGame, type GameConfig } from '../core/gameState.js';
import { el } from './dom.js';
import { renderSettingsScreen } from './settingsScreen.js';

const app = el('main', { id: 'app' });
document.body.append(app);

const startNewGame = (config: GameConfig): void => {
  const state = startGame(config, generateSecret(config.length, config.base));
  app.replaceChildren(el('p', {}, `Game started: ${state.config.length} digits, base ${state.config.base}`));
};

app.replaceChildren(renderSettingsScreen(startNewGame));
