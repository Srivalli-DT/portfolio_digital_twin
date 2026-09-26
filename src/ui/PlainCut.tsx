import { moreWork, projects } from '../content/projects';
import { about, site } from '../content/site';
import { useFilm, WEBGL } from '../state/store';
import ContactLinks from './ContactLinks';
import PlainProject from './PlainProject';
import styles from './PlainCut.module.css';

// The plain cut: the whole portfolio as a simple page, no 3D (SPEC section 8).
// Shown from the slate/header, and automatically when the browser has no WebGL.
export default function PlainCut() {
  const closePlain = useFilm((state) => state.closePlain);

  return (
    <main className={styles.plain}>
      <div className={styles.page}>
        <header className={styles.top}>
          <h1 className={styles.name}>{site.name}</h1>
          <p className={styles.intro}>{site.plainCut.intro}</p>
          <ContactLinks />
          {/* No way back to the film if this browser can't draw it. */}
          {WEBGL && (
            <button className={styles.back} onClick={closePlain} autoFocus>
              {site.plainCut.watchFilm}
            </button>
          )}
        </header>

        <section aria-labelledby="plain-work">
          <h2 id="plain-work" className={styles.heading}>
            {site.plainCut.work}
          </h2>
          {projects.map((project) => (
            <PlainProject key={project.id} project={project} />
          ))}
        </section>

        <section aria-labelledby="plain-more">
          <h2 id="plain-more" className={styles.heading}>
            {site.plainCut.moreWork}
          </h2>
          <ul className={styles.list}>
            {moreWork.map((work) => (
              <li key={work.href}>
                <a href={work.href} target="_blank" rel="noreferrer">
                  {work.title} ↗
                </a>{' '}
                {work.note}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="plain-about">
          <h2 id="plain-about" className={styles.heading}>
            {site.plainCut.about}
          </h2>
          {about.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <h3 className={styles.subheading}>{site.plainCut.skills}</h3>
          <ul className={styles.list}>
            {about.crew.map((row) => (
              <li key={row.role}>
                <span className={styles.label}>{row.role}</span> {row.names}
              </li>
            ))}
          </ul>
          {about.education.length > 0 && (
            <>
              <h3 className={styles.subheading}>{site.plainCut.education}</h3>
              <ul className={styles.list}>
                {about.education.map((item) => (
                  <li key={item.place}>
                    {item.place}, {item.detail}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section aria-labelledby="plain-contact">
          <h2 id="plain-contact" className={styles.heading}>
            {site.plainCut.contact}
          </h2>
          <ContactLinks />
        </section>
      </div>
    </main>
  );
}
