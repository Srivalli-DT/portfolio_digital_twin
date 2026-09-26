import { site } from '../content/site';
import styles from './Subtitles.module.css';

type SubtitlesProps = {
  // The part of the line typed so far.
  text: string;
  // The whole line, announced once to screen readers (instead of letter by letter).
  fullLine: string;
  onAdvance: () => void;
};

// The crow's words, bottom-centre, italic serif. Click (or Enter/Space) to finish or continue.
export default function Subtitles({ text, fullLine, onAdvance }: SubtitlesProps) {
  return (
    <>
      <button
        className={styles.subtitle}
        onClick={onAdvance}
        aria-label={site.dialogue.continueLabel}
      >
        <span aria-hidden="true">{text}</span>
      </button>
      <p className={styles.srOnly} aria-live="polite">
        {fullLine}
      </p>
    </>
  );
}
