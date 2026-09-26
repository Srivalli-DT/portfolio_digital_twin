import gsap from 'gsap';

// The ONLY easings allowed on the site (CLAUDE.md): smooth for moves, gentle for fades.
export const EASE_MOVE = 'power2.inOut';
export const EASE_FADE = 'power1.out';

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The full-screen black layer used for cuts. CutOverlay registers it on mount.
let cutElement: HTMLElement | null = null;

export function registerCutElement(element: HTMLElement | null): void {
  cutElement = element;
}

// Transition 1, hard cut to black: fade to ink (300ms), run `during` while the screen is black,
// hold, then fade back in.
export function cutToBlack(during: () => void, holdSeconds = 0.4): Promise<void> {
  return new Promise((resolve) => {
    if (!cutElement) {
      during();
      resolve();
      return;
    }
    gsap
      .timeline({ onComplete: resolve })
      .to(cutElement, { opacity: 1, duration: 0.3, ease: EASE_FADE })
      .call(during)
      .to(cutElement, { opacity: 0, duration: 0.3, ease: EASE_FADE }, `+=${holdSeconds}`);
  });
}

// Start fully black and slowly reveal the scene (used when the title card ends).
export function fadeFromBlack(durationSeconds = 1.5): void {
  if (!cutElement) return;
  gsap.fromTo(
    cutElement,
    { opacity: 1 },
    { opacity: 0, duration: durationSeconds, ease: EASE_FADE },
  );
}
