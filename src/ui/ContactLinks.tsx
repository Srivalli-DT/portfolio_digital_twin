import { about } from '../content/site';
import styles from './ContactLinks.module.css';

type ContactLinksProps = { className?: string };

// Email (if set) and profile links. Shared by the credits and the plain cut.
export default function ContactLinks({ className = '' }: ContactLinksProps) {
  return (
    <ul className={`${styles.list} ${className}`}>
      {about.email && (
        <li>
          <a href={`mailto:${about.email}`}>{about.email}</a>
        </li>
      )}
      {about.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
