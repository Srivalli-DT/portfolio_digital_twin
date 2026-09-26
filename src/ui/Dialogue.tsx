import { useEffect } from 'react';
import type { DialogueNode } from '../content/dialogue';
import { useFilm } from '../state/store';
import DialogueMenu from './DialogueMenu';
import Subtitles from './Subtitles';
import { useTypewriter } from './useTypewriter';
import styles from './Dialogue.module.css';

type DialogueProps = { node: DialogueNode };

// One beat of conversation: the crow's lines as subtitles, then the question chips.
// App gives this a `key` per node, so each new node starts fresh from its first line.
// Esc (handled once, in App) closes it.
export default function Dialogue({ node }: DialogueProps) {
  const { text, line, typing, finished, advance } = useTypewriter(node.lines);
  const setTalking = useFilm((state) => state.setTalking);

  // Tell the crow's beak when to move.
  useEffect(() => {
    setTalking(typing);
  }, [typing, setTalking]);
  useEffect(() => () => setTalking(false), [setTalking]);

  return (
    <div className={styles.dialogue}>
      {finished && <DialogueMenu options={node.options} link={node.link} />}
      <Subtitles text={text} fullLine={line} onAdvance={advance} />
    </div>
  );
}
