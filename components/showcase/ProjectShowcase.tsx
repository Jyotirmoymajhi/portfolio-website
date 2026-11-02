'use client';

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';
import { projects } from './projects';
import { ProjectContent } from './ProjectContent';
import { ProjectImage } from './ProjectImage';
import { ProjectThumbnails } from './ProjectThumbnails';
import { ProjectNavigation } from './ProjectNavigation';
import styles from './ProjectShowcase.module.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const ease = [0.65, 0, 0.35, 1] as const;

export function ProjectShowcase() {
  const section = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const current = useRef(0);
  const lockUntil = useRef(0);
  const pending = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  useEffect(() => {
    const media = matchMedia('(min-width: 768px)');
    const update = () => setDesktop(media.matches);
    update(); setReady(true); media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); if (timer.current) clearTimeout(timer.current); };
  }, []);

  const change = useCallback((index: number) => {
    if (index === current.current || index < 0 || index >= projects.length) return;
    // Restore focus before the outgoing link is removed; navigation stays mounted.
    if (document.activeElement?.closest('[data-project-content]')) card.current?.focus({ preventScroll: true });
    setDirection(index > current.current ? 1 : -1);
    current.current = index;
    setActive(index);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    if (!desktop || performance.now() < lockUntil.current) return;
    // Hysteresis prevents threshold jitter; coalesce quick trackpad movements.
    const next = Math.min(2, Math.max(0, Math.floor(progress * 3)));
    const boundary = next > current.current ? next / 3 + 0.025 : (next + 1) / 3 - 0.025;
    if (next === current.current || (next > current.current ? progress < boundary : progress > boundary)) return;
    pending.current = next;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => change(pending.current), 90);
  });

  const select = useCallback((index: number) => {
    if (index < 0 || index >= projects.length) return;
    if (timer.current) clearTimeout(timer.current);
    lockUntil.current = performance.now() + 1000;
    change(index);
    if (desktop && section.current) {
      const top = section.current.getBoundingClientRect().top + window.scrollY;
      const distance = section.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + distance * ((index + 0.5) / 3), behavior: 'instant' });
    }
  }, [change, desktop]);

  useEffect(() => {
    const followHash = () => {
      const index = projects.findIndex(project => '#' + project.id === window.location.hash);
      if (index >= 0) select(index);
    };
    followHash(); window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, [select]);

  useEffect(() => {
    const image = new window.Image();
    image.src = projects[(active + 1) % projects.length].image;
  }, [active]);

  const project = projects[active];
  const duration = reduced ? 0 : 0.36;
  const textVariants = {
    enter: (d: number) => ({ opacity: 0, y: reduced ? 0 : 24 * d }),
    visible: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: reduced ? 0 : -24 * d }),
  };

  return <section ref={section} className={`${styles.section} ${inter.className}`} aria-label="Selected project showcase">
    <div className={styles.sticky}>
      <div className={styles.scrollHint} aria-hidden="true"><span><i style={{ top: `${active * 45 + 5}%` }} /></span><small>SCROLL<br />TO EXPLORE</small></div>
      <div ref={card} className={styles.card} data-ready={ready} tabIndex={-1} aria-roledescription="carousel" aria-label="Portfolio projects" onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(current.current + (event.key === 'ArrowRight' ? 1 : -1)); }
      }}>
        <div className={styles.contentViewport}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div key={project.id} data-project-content={project.id} className={styles.content} initial="enter" animate="visible" exit="exit" transition={{ duration, ease }} variants={{ enter: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } }, exit: { transition: { staggerChildren: 0 } } }}>
              <motion.div custom={direction} className={styles.heading} variants={textVariants} transition={{ duration, ease }}><ProjectContent project={project} part="heading" /></motion.div>
              <motion.div className={styles.imageViewport} custom={direction} variants={{ enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : 45 * d, scale: reduced ? 1 : 0.97 }), visible: { opacity: 1, x: 0, scale: 1 }, exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : -40 * d, scale: reduced ? 1 : 0.97 }) }} transition={{ duration, ease }}><ProjectImage project={project} /></motion.div>
              <motion.div custom={direction} className={styles.body} variants={textVariants} transition={{ duration, ease }}><ProjectContent project={project} part="description" /></motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.footer}><ProjectThumbnails active={active} select={select} /><ProjectNavigation active={active} select={select} /></div>
        <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{project.name}, project {active + 1} of 3</span>
      </div>
    </div>
  </section>;
}
