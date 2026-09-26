import { site } from '../content/site';
import { useFilm } from '../state/store';
import styles from './TalkButton.module.css';

// The keyboard/touch equivalent of clicking the crow. Shown in the field when nobody's talking.
export default function TalkButton() {
  const openDialogue = useFilm((state) => state.openDialogue);
  const label = site.dialogue.talk.replace('{crow}', site.crowName);

  return (
    <button className={styles.talk} onClick={() => openDialogue()}>
      {label}
    </button>
  );
}
