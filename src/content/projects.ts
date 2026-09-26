import type { ReelId } from '../state/store';

// The three reels. Phase 5 adds the full case study (logline, body, links, poster) to each.
export type Project = {
  id: string;
  reel: ReelId;
  title: string;
};

export const projects: Project[] = [
  { id: 'reel-1', reel: 'I', title: 'Space Atlas' },
  { id: 'reel-2', reel: 'II', title: 'Memory of a City' },
  { id: 'reel-3', reel: 'III', title: 'IoT Lab Inventory' },
];

export function projectFor(reel: ReelId): Project {
  const project = projects.find((p) => p.reel === reel);
  if (!project) throw new Error(`No project for reel ${reel}`);
  return project;
}
