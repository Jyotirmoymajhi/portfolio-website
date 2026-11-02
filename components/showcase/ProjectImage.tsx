import Image from 'next/image';
import type { Project } from './projects';
import styles from './ProjectShowcase.module.css';
import { SitStickImage } from './SitStickImage';

export function ProjectImage({ project }: { project: Project }) {
  if (project.id === 'sitstick') return <SitStickImage />;
  return <div className={styles.imageFrame}><Image className={styles.artwork} style={{ objectFit: 'contain' }} src={project.image} alt={project.alt} fill sizes="(max-width: 767px) 94vw, 65vw" priority /></div>;
}
