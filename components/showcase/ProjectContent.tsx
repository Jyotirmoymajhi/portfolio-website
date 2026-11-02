import { ArrowUpRight, Box } from 'lucide-react';
import type { Project } from './projects';
import styles from './ProjectShowcase.module.css';

export function ProjectContent({ project, part }: { project: Project; part: 'heading' | 'description' }) {
  if (part === 'heading') return <>
    <span className={styles.category}><Box size={20} aria-hidden="true" />{project.category}</span>
    <h2 className={styles.title}>{project.name}</h2>
    <p className={styles.disciplines}>{project.disciplines}</p>
    <h3 className={styles.headline}>{project.headline[0]}<br /><span>{project.headline[1]}</span></h3>
  </>;
  return <>
    <p className={styles.description}>{project.description}</p>
    <p className={styles.additional}>{project.additional}</p>
    <a className={styles.cta} href={project.href} target={project.href.startsWith('https') ? '_blank' : undefined} rel={project.href.startsWith('https') ? 'noopener noreferrer' : undefined}>View Project <ArrowUpRight size={19} aria-hidden="true" /></a>
  </>;
}
