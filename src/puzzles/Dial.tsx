import type { KeyboardEvent } from 'react';
import { canisterPuzzle } from '../content/puzzles';
import styles from './Dial.module.css';

type DialProps = {
  // 1, 2 or 3 (for the spoken label).
  index: number;
  value: number;
  onTurn: (delta: 1 | -1) => void;
  disabled: boolean;
};

// One number dial on the canister lock (0–9, wraps around).
// Keyboard: focus it and press ↑/↓. Touch/mouse: the ▲ ▼ buttons.
export default function Dial({ index, value, onTurn, disabled }: DialProps) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'ArrowUp') onTurn(1);
    else if (event.key === 'ArrowDown') onTurn(-1);
    else return;
    event.preventDefault();
  };

  return (
    <div className={styles.dial}>
      <button
        className={styles.arrow}
        onClick={() => onTurn(1)}
        disabled={disabled}
        aria-label={`${canisterPuzzle.dialLabel.replace('{n}', String(index))} ${canisterPuzzle.up}`}
        tabIndex={-1}
      >
        ▲
      </button>
      <div
        className={styles.value}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={canisterPuzzle.dialLabel.replace('{n}', String(index))}
        aria-valuemin={0}
        aria-valuemax={9}
        aria-valuenow={value}
        aria-disabled={disabled}
        onKeyDown={onKeyDown}
      >
        {value}
      </div>
      <button
        className={styles.arrow}
        onClick={() => onTurn(-1)}
        disabled={disabled}
        aria-label={`${canisterPuzzle.dialLabel.replace('{n}', String(index))} ${canisterPuzzle.down}`}
        tabIndex={-1}
      >
        ▼
      </button>
    </div>
  );
}
