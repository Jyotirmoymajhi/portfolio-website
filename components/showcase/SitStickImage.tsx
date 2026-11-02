'use client';

import Image from 'next/image';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import layout from './ProjectShowcase.module.css';
import styles from './SitStickImage.module.css';

// Survives carousel remounts, but resets on a new page visit.
let entered = false;

export function SitStickImage() {
  const frame = useRef<HTMLDivElement>(null);
  const visible = useInView(frame);
  const reduced = useReducedMotion();
  const [first] = useState(() => !entered);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const scroll = useMotionValue(0);
  const x = useSpring(px, { stiffness: 80, damping: 24 });
  const y = useSpring(py, { stiffness: 80, damping: 24 });
  const scrollY = useSpring(scroll, { stiffness: 60, damping: 25 });

  useEffect(() => { if (visible) entered = true; }, [visible]);
  useEffect(() => {
    if (reduced || !visible) { px.set(0); py.set(0); scroll.set(0); return; }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = frame.current?.getBoundingClientRect();
        if (!rect) return;
        const range = innerWidth < 768 ? 0 : innerWidth <= 1050 ? 3 : 6;
        scroll.set(Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / (innerHeight / 2))) * range);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [visible, reduced, px, py, scroll]);

  return <div ref={frame} className={`${layout.imageFrame} ${styles.frame}`} data-visible={visible} onPointerMove={event => {
    if (reduced || !visible || !matchMedia('(min-width: 1051px) and (hover: hover) and (pointer: fine)').matches || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((0.5 - (event.clientX - rect.left) / rect.width) * 12);
    py.set((0.5 - (event.clientY - rect.top) / rect.height) * 8);
  }} onPointerLeave={() => { px.set(0); py.set(0); }}>
    <motion.div className={styles.entrance} initial={first && !reduced ? { opacity: 0, scale: 1.025, y: 12 } : false} animate={visible || reduced || !first ? { opacity: 1, scale: 1, y: 0 } : undefined} transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div className={styles.layer} style={{ y: reduced ? 0 : scrollY }}>
        <motion.div className={styles.layer} style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}>
          <div className={styles.picture}><Image priority unoptimized src="/images/showcase/sitstick-park.png" alt="An older adult resting on the SitStick mobility seat while walking through a park with a companion." fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'cover', objectPosition: '74% 50%' }} /></div>
        </motion.div>
      </motion.div>
      <div className={styles.environment} aria-hidden="true"><span className={styles.sun} /><span className={styles.water} /><span className={styles.foreground} />{[0, 1, 2].map(i => <i key={i} className={styles.dust} style={{ left: `${8 + i * 14}%`, top: `${16 + i * 18}%`, animationDelay: `${-i * 5}s` }} />)}</div>
    </motion.div>
  </div>;
}


