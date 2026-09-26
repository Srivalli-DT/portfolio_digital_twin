import { useEffect, useRef } from 'react';
import type { DialogueNode } from '../content/dialogue';
import { site } from '../content/site';
import { useFilm } from '../state/store';
import styles from './DialogueMenu.module.css';

type DialogueMenuProps = Pick<DialogueNode, 'options' | 'link'>;

// The question "chips" above the subtitles. No free text: only these choices.
export default function DialogueMenu({ options, link }: DialogueMenuProps) {
  const chooseOption = useFilm((state) => state.chooseOption);
  const menu = useRef<HTMLElement>(null);

  // Move keyboard focus to the first chip so Tab/Enter work straight away.
  useEffect(() => {
    menu.current?.querySelector('button')?.focus();
  }, []);

  return (
    <nav ref={menu} className={styles.menu} aria-label={site.dialogue.menuLabel}>
      {options.map((option) => (
        <button
          key={option.label}
          className={styles.chip}
          onClick={() => chooseOption(option.next)}
        >
          {option.label}
        </button>
      ))}
      {link && (
        <a className={styles.chip} href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      )}
    </nav>
  );
}
