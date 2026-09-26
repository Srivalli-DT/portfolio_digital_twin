// Everything the crow says. The crow speaks as ME (first person). Edit freely.
// Each node is one "beat": lines play in order, then the options appear as chips.
// An option's `next` is another node's id, or 'close' (end the talk), or 'credits' (roll the credits).

import { hints } from './puzzles';

export type DialogueOption = { label: string; next: string };

export type DialogueNode = {
  id: string;
  lines: string[];
  options: DialogueOption[];
  // Optional link shown next to the chips (e.g. the site's code).
  link?: { label: string; href: string };
};

// Shown at the end of every answer, so the visitor can keep asking or stop.
const AFTER_ANSWER: DialogueOption[] = [
  { label: 'Ask something else', next: 'menu' },
  { label: "That's all", next: 'close' },
];

const nodes: DialogueNode[] = [
  {
    id: 'arrival',
    lines: ['You came. Good.', "I've been keeping the reels."],
    options: [
      { label: 'Who are you?', next: 'who' },
      { label: 'Just looking', next: 'close' },
    ],
  },
  {
    id: 'menu',
    lines: ['Ask me something. Anything on this list, anyway.'],
    options: [
      { label: 'Who are you?', next: 'who' },
      { label: 'What do you make?', next: 'make' },
      { label: 'What are you looking for?', next: 'looking' },
      { label: 'How old are you, crow?', next: 'age' },
      { label: 'How was this made?', next: 'made' },
      { label: 'How do I reach you?', next: 'reach' },
      { label: 'Nothing for now', next: 'close' },
    ],
  },
  {
    id: 'who',
    lines: [
      "I'm Srivalli. A crow version, anyway.",
      "I'm a scripted twin: everything I say, Srivalli wrote.",
    ],
    options: AFTER_ANSWER,
  },
  {
    id: 'make',
    lines: [
      'I build full-stack web apps. React in front, Node and databases behind.',
      'A solar-system atlas. A city that remembers. A lab that keeps track of its own parts.',
      'I like shiny problems.',
    ],
    options: AFTER_ANSWER,
  },
  {
    id: 'looking',
    lines: ['Internships, mostly. And people to build things with.'],
    options: AFTER_ANSWER,
  },
  {
    // The clue for Puzzle III lives here: the crow's age is the third number of the lock.
    id: 'age',
    lines: ['Four winters.', 'Crows remember numbers. You might want to, too.'],
    options: AFTER_ANSWER,
  },
  {
    id: 'made',
    lines: [
      'Vite, React, three.js, a small store for the story, and a lot of fog.',
      'No AI in me. Just a script.',
    ],
    options: AFTER_ANSWER,
    link: {
      label: 'see the code ↗',
      href: 'https://github.com/Srivalli-DT/portfolio_digital_twin',
    },
  },
  {
    id: 'reach',
    lines: ['Everything you need is in the credits.'],
    options: [
      { label: 'Roll the credits', next: 'credits' },
      { label: 'Ask something else', next: 'menu' },
    ],
  },
];

// Puzzle hints (written in puzzles.ts) become nodes too: 'hint-I', 'hint-II', 'hint-III'.
const hintNodes: DialogueNode[] = Object.entries(hints).map(([reel, hint]) => ({
  id: `hint-${reel}`,
  lines: [hint],
  options: [{ label: 'Thanks', next: 'close' }],
}));

export const dialogue: Record<string, DialogueNode> = Object.fromEntries(
  [...nodes, ...hintNodes].map((node) => [node.id, node]),
);
