// Site-wide text. Edit freely: no component hard-codes any of these words.
const NAME = 'Srivalli';

export const site = {
  name: NAME,
  filmTitle: 'The Field',

  slate: {
    tagline: 'a film in three reels',
    enterWithSound: 'Enter (with sound)',
    enterSilent: 'Enter (silent)',
    plainCut: 'Watch the plain cut →',
  },

  titleCard: {
    byline: `a film by ${NAME}`,
    skipHint: 'click to skip',
  },

  header: {
    credits: 'credits',
    soundOn: 'sound on',
    soundOff: 'sound off',
    plainCut: 'plain cut',
    // Read by screen readers instead of the ● ○ ○ marks. {n} is replaced with the count.
    progressLabel: '{n} of 3 reels watched',
  },

  credits: {
    heading: 'Written & directed by',
    placeholder: 'The full credits roll arrives in Phase 6.',
    backToField: 'back to field',
  },

  plainCut: {
    placeholder: 'The plain cut arrives in Phase 6.',
    back: '← back',
  },
} as const;
