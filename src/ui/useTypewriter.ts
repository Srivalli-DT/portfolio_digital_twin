import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/transitions';

const CHARS_PER_SECOND = 40;

// Types out `lines` one at a time. `advance()` first finishes the current line, then moves to the next.
export function useTypewriter(lines: readonly string[]) {
  const [lineIndex, setLineIndex] = useState(0);
  const [count, setCount] = useState(0);

  const line = lines[lineIndex] ?? '';
  // Reduced motion: show whole lines at once instead of typing.
  const shown = prefersReducedMotion() ? line.length : Math.min(count, line.length);
  const typing = shown < line.length;
  const isLastLine = lineIndex >= lines.length - 1;

  useEffect(() => {
    if (!typing) return;
    const timer = window.setInterval(() => setCount((c) => c + 1), 1000 / CHARS_PER_SECOND);
    return () => window.clearInterval(timer);
  }, [typing]);

  const advance = () => {
    if (typing) {
      setCount(line.length);
    } else if (!isLastLine) {
      setLineIndex((i) => i + 1);
      setCount(0);
    }
  };

  return {
    text: line.slice(0, shown),
    line,
    typing,
    // Every line has been fully shown.
    finished: isLastLine && !typing,
    advance,
  };
}
