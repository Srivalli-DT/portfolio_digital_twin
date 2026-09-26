import type { ReelId } from '../state/store';

// The three reels (case studies) and the "more work" list. All project text lives here.
// Lines marked TODO(you) were drafted from the repos' READMEs: please check or rewrite them.

export type Project = {
  id: string;
  reel: ReelId;
  title: string;
  // One sentence, like a film logline.
  logline: string;
  year: string;
  role: string;
  tools: string[];
  // Paths inside public/. clip is optional: a short muted video (≤ 4MB).
  media: { poster: string; clip?: string };
  // Three short paragraphs: the problem, what was done, what came of it.
  body: [string, string, string];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: 'reel-1',
    reel: 'I',
    title: 'Space Atlas',
    logline: 'A field guide to the Solar System, one planet, moon and comet at a time.',
    year: '2025',
    // TODO(you): confirm. You are the only contributor on GitHub.
    role: 'Solo · full stack',
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    media: { poster: 'images/reels/reel-1.webp' },
    body: [
      'Space facts live in a hundred open tabs. I wanted one calm place to browse the Solar System: planets, moons, asteroids, dwarf planets and comets, each with a NASA image and a few facts worth keeping.',
      'I built a React front end with search and type filters on top of a Node and Express API, backed by MongoDB and seeded with 30+ bodies. An admin area behind JWT login, with hashed passwords, rate limiting and security headers, handles creating, editing and deleting entries.',
      // TODO(you): replace with what you actually learned or achieved.
      'It taught me to treat the backend as part of the product: seed data, authentication, and the small security defaults that are easy to skip.',
    ],
    links: [{ label: 'Code', href: 'https://github.com/Srivalli-DT/Space-Atlas-backend-codes' }],
  },
  {
    id: 'reel-2',
    reel: 'II',
    title: 'Memory of a City',
    logline:
      'Three Bengaluru neighbourhoods, sixteen years of change, and an investigator that won’t invent a cause.',
    year: '2026',
    // TODO(you): say what YOUR part was, e.g. "Team of 3 · front end".
    role: 'Team project',
    tools: ['React', 'TypeScript', 'Tailwind', 'Express', 'Gemini API'],
    media: { poster: 'images/reels/reel-2.webp' },
    body: [
      'Cities change faster than anyone remembers. The question was how to show what changed in Indiranagar, Koramangala and Whitefield between 2010 and 2026, and help people think about why.',
      'We built a React and Tailwind explorer on an Express API, plus a “City Change Investigator” that sends Gemini only the chosen neighbourhood, years and evidence, with instructions never to invent facts and to say so when the evidence can’t explain a change.',
      // TODO(you): replace with what you actually learned or achieved.
      'The lesson: an AI feature is only as honest as its guardrails. When the model is unavailable the app says so plainly and keeps working, and the demo dataset is labelled as demo data everywhere.',
    ],
    links: [{ label: 'Code', href: 'https://github.com/Meghna-K03/Memory-of--a-city' }],
  },
  {
    id: 'reel-3',
    reel: 'III',
    title: 'IoT Lab Inventory',
    logline: 'A lab that knows what it owns, who borrowed it, and what to reorder.',
    year: '2025–26',
    // TODO(you): say what YOUR part was. GitHub doesn't show your commits on this repo.
    role: 'Team project',
    tools: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    media: { poster: 'images/reels/reel-3.webp' },
    body: [
      'An IoT lab full of sensors, boards and motors was tracked by hand, so parts went missing and nobody knew what to reorder until a project stalled.',
      'The team built a MERN app to add and tag components, log borrows and returns, flag low stock and generate a procurement list, with tag-based recommendations for project kits and an optional panel to switch the lab’s lights and fans.',
      // TODO(you): replace with what you actually learned or achieved.
      'It turns a cupboard into a searchable, accountable inventory, and it was a lesson in designing around real people’s habits rather than ideal ones.',
    ],
    links: [
      { label: 'Code', href: 'https://github.com/ibrahimarshath/IoT-Lab-Inventory-Management' },
    ],
  },
];

// Smaller work: listed plainly in the credits and the plain cut (no reel, no puzzle).
export const moreWork = [
  {
    title: 'Help-Desk Bug Fix',
    note: 'Bug fixes to the open-source django-helpdesk.',
    href: 'https://github.com/Srivalli-DT/Help-Desk-Bug-Fix',
  },
  {
    title: 'eDoc',
    note: 'A doctor appointment system in PHP and MySQL, with Docker. Team project.',
    href: 'https://github.com/Meghna-K03/Hospital-appointments',
  },
];

export function projectFor(reel: ReelId): Project {
  const project = projects.find((p) => p.reel === reel);
  if (!project) throw new Error(`No project for reel ${reel}`);
  return project;
}
