import Image from 'next/image';
import { projects } from './projects';
import styles from './ProjectShowcase.module.css';

export function ProjectThumbnails({ active, select }: { active: number; select: (index: number) => void }) {
  return <nav className={styles.thumbnails} aria-label="Choose a project">
    {projects.map((project, index) => <button key={project.id} type="button" aria-label={`Show ${project.name}`} aria-current={active === index ? 'true' : undefined} onClick={() => select(index)}>
      <span className={styles.thumbnailImage}><Image src={project.image} alt="" fill sizes="110px" loading="eager" /><span>{String(index + 1).padStart(2, '0')}</span></span>
      <span className={styles.thumbnailName}>{project.name}</span>
    </button>)}
  </nav>;
}
