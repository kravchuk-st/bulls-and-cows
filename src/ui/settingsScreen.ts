import type { Base } from '../core/createDigitValidator.js';
import { getAvailableLengths } from '../core/gameConfig.js';
import type { GameConfig } from '../core/gameState.js';
import { el } from './dom.js';

const BASES: readonly { readonly base: Base; readonly label: string }[] = [
  { base: 2, label: 'Binary (2)' },
  { base: 8, label: 'Octal (8)' },
  { base: 10, label: 'Decimal (10)' },
  { base: 16, label: 'Hexadecimal (16)' },
];

const DEFAULT_BASE: Base = 10;
const DEFAULT_LENGTH = 4;

export const renderSettingsScreen = (onStart: (config: GameConfig) => void): HTMLElement => {
  const baseSelect = el(
    'select',
    { id: 'base' },
    ...BASES.map(({ base, label }) => el('option', { value: String(base), selected: base === DEFAULT_BASE }, label)),
  );
  const lengthSelect = el('select', { id: 'length' });

  const readBase = (): Base => BASES.find(({ base }) => String(base) === baseSelect.value)?.base ?? DEFAULT_BASE;

  const updateLengths = (): void => {
    lengthSelect.replaceChildren(
      ...getAvailableLengths(readBase()).map((length) =>
        el('option', { value: String(length), selected: length === DEFAULT_LENGTH }, String(length)),
      ),
    );
  };

  baseSelect.onchange = updateLengths;
  updateLengths();

  const startButton = el(
    'button',
    {
      type: 'button',
      onclick: () => onStart({ length: Number(lengthSelect.value), base: readBase() }),
    },
    'Start',
  );

  return el(
    'section',
    { className: 'settings' },
    el('h1', {}, 'Bulls and Cows'),
    el('label', { htmlFor: 'base' }, 'Number system'),
    baseSelect,
    el('label', { htmlFor: 'length' }, 'Secret length'),
    lengthSelect,
    startButton,
  );
};
