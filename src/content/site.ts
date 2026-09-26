// Site-wide text. Edit freely: no component hard-codes any of these words.
const NAME = 'Srivalli';

export const site = {
  name: NAME,
  filmTitle: 'The Field',
  // The crow is my digital twin: it speaks as me. Its lines are in dialogue.ts.
  crowName: 'Wick',

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
    // Spoken label for each ● ○ ○ reel button.
    reelLabel: 'Reel {reel}: {title} ({state})',
    watched: 'watched',
    unwatched: 'not watched yet',
  },

  dialogue: {
    // {crow} is replaced with crowName.
    talk: 'talk to {crow}',
    // Read by screen readers on the subtitle button.
    continueLabel: 'continue',
    menuLabel: 'questions for the crow',
  },

  reel: {
    close: 'close reel',
  },

  credits: {
    heading: 'Written & directed by',
    crew: 'Crew',
    education: 'Education',
    moreWork: 'Also screening',
    contact: 'Contact',
    thanks: 'Special thanks',
    fin: 'fin.',
    replay: 'replay',
    backToField: 'back to field',
  },

  plainCut: {
    // One line under your name at the top of the plain page.
    intro: 'Student developer. Full-stack web apps, and a little 3D.',
    work: 'Work',
    moreWork: 'More work',
    about: 'About',
    skills: 'Skills',
    education: 'Education',
    contact: 'Contact',
    watchFilm: 'Watch the film →',
    reelLabel: 'Reel {reel}',
    posterAlt: 'Title card for {title}',
  },
} as const;

// About me, for the credits and the plain cut. Empty fields are simply not shown.
// Lines marked TODO(you) are drafts or blanks for you to fill in.
export const about: {
  bio: string[];
  crew: { role: string; names: string }[];
  education: { place: string; detail: string }[];
  email: string;
  links: { label: string; href: string }[];
  thanks: string[];
} = {
  // TODO(you): rewrite in your own voice (3–4 sentences).
  bio: [
    'I build full-stack web apps and like the moment code turns into something you can see.',
    'I work across React front ends and Node, Express and MongoDB back ends, and lately I have been learning 3D on the web.',
    'I care about calm interfaces, honest data and code other people can pick up.',
  ],
  // TODO(you): check these match what you actually use.
  crew: [
    { role: 'Front end', names: 'React · TypeScript · Vite · three.js' },
    { role: 'Back end', names: 'Node.js · Express · MongoDB · REST APIs' },
    { role: 'Also', names: 'Python · Django · Git' },
  ],
  // TODO(you): e.g. { place: 'Your University', detail: 'B.Tech, Computer Science, 2023–2027' }
  education: [],
  // TODO(you): the email you want public. Left empty, it is hidden.
  email: '',
  // TODO(you): add LinkedIn and any other links.
  links: [{ label: 'GitHub', href: 'https://github.com/Srivalli-DT' }],
  thanks: [
    'My teammates on Memory of a City, IoT Lab Inventory and eDoc.',
    'The people behind django-helpdesk, for code worth fixing.',
  ],
};
