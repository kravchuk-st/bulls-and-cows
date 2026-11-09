import { createDigitValidator } from '../core/createDigitValidator.js';
import { formatDuration } from '../core/formatDuration.js';
import { addAttempt, hasAttempted, isWon, type Attempt, type GameState } from '../core/gameState.js';
import { isValidGuess } from '../core/isValidGuess.js';
import { el } from './dom.js';

interface GameScreenHandlers {
  readonly onWin: (state: GameState, timeMs: number) => void;
  readonly onNewGame: () => void;
}

const renderAttempt = ({ guess, bulls, cows }: Attempt): HTMLElement =>
  el('li', {}, `${guess.toUpperCase()}: bulls ${bulls}, cows ${cows}`);

export const renderGameScreen = (initialState: GameState, { onWin, onNewGame }: GameScreenHandlers): HTMLElement => {
  const { length, base } = initialState.config;
  const isDigit = createDigitValidator(base);
  const startedAt = Date.now();
  let state = initialState;

  const timer = el('span', { className: 'timer' }, formatDuration(0));
  const message = el('p', { className: 'message' });
  const history = el('ol', { className: 'history' });
  const input = el('input', { type: 'text', maxLength: length, autocomplete: 'off' });

  const intervalId = setInterval(() => {
    timer.textContent = formatDuration(Date.now() - startedAt);
  }, 1000);

  const submit = (): void => {
    if (!isValidGuess(input.value, length, base)) {
      message.textContent = `Enter ${length} different digits of base ${base}`;
      return;
    }

    if (hasAttempted(state, input.value)) {
      message.textContent = 'You already tried this number';
      return;
    }

    state = addAttempt(state, input.value);
    message.textContent = '';
    input.value = '';
    history.replaceChildren(...state.attempts.map(renderAttempt));

    if (isWon(state)) {
      clearInterval(intervalId);
      onWin(state, Date.now() - startedAt);
    }
  };

  input.oninput = () => {
    input.value = [...input.value].filter(isDigit).join('');
  };
  input.onkeydown = (event) => {
    if (event.key === 'Enter') {
      submit();
    }
  };

  return el(
    'section',
    { className: 'game' },
    el('h1', {}, 'Bulls and Cows'),
    el('p', {}, `Guess ${length} different digits (base ${base}). Time: `, timer),
    input,
    el('button', { type: 'button', onclick: submit }, 'Guess'),
    el(
      'button',
      {
        type: 'button',
        onclick: () => {
          clearInterval(intervalId);
          onNewGame();
        },
      },
      'New game',
    ),
    message,
    history,
  );
};
