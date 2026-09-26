import type { Project } from '../content/projects';
import { site } from '../content/site';
import { asset } from '../lib/asset';
import styles from './PlainCut.module.css';

type PlainProjectProps = { project: Project };

// One project on the plain cut: poster, then the same case study as the reel panel.
export default function PlainProject({ project }: PlainProjectProps) {
  return (
    <article className={styles.project} aria-labelledby={`${project.id}-title`}>
      <img
        className={styles.poster}
        src={asset(project.media.poster)}
        alt={site.plainCut.posterAlt.replace('{title}', project.title)}
        width={1024}
        height={576}
        loading="lazy"
      />
      <p className={styles.label}>{site.plainCut.reelLabel.replace('{reel}', project.reel)}</p>
      <h3 id={`${project.id}-title`} className={styles.projectTitle}>
        {project.title}
      </h3>
      <p className={styles.logline}>{project.logline}</p>
      <p className={styles.meta}>
        {project.year} · {project.role} · {project.tools.join(', ')}
      </p>
      {project.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ul className={styles.inline}>
        {project.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
