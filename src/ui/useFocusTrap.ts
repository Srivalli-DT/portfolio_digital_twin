import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]';

// Keeps Tab / Shift+Tab cycling inside an open panel, and focuses its first control on open.
export function useFocusTrap(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = container.current;
    if (!panel) return;
    const focusable = () => [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      // Wrap around at either end.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', onKey);
    return () => panel.removeEventListener('keydown', onKey);
  }, [container]);
}
