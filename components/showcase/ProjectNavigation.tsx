import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from './projects';
import styles from './ProjectShowcase.module.css';

export function ProjectNavigation({ active, select }: { active: number; select: (index: number) => void }) {
  return <nav className={styles.navigation} aria-label="Project navigation">
    <button type="button" aria-label="Previous project" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft size={22} /></button>
    <span><strong>{String(active + 1).padStart(2, '0')}</strong><span> / 03</span></span>
    <button type="button" aria-label="Next project" disabled={active === projects.length - 1} onClick={() => select(active + 1)}><ArrowRight size={22} /></button>
  </nav>;
}
