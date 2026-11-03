'use client';

import Image from 'next/image';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import layout from './ProjectShowcase.module.css';
import styles from './SitStickImage.module.css';

export function SitStickImage() {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const visible = useInView(frame);
  const reduced = useReducedMotion();
  const [story, setStory] = useState(0);
  const [started, setStarted] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const progress = useMotionValue(1);
  const x = useSpring(px, { stiffness: 90, damping: 25 });
  const y = useSpring(py, { stiffness: 90, damping: 25 });
  const approach = useSpring(progress, { stiffness: 90, damping: 25 });
  const scrollY = useTransform(approach, [0, 1], [14, 0]);
  const opacity = useTransform(approach, [0, 1], [.65, 1]);
  const scale = useTransform(approach, [0, 1], [1.018, 1]);

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    // Fit the artwork plane, including animation clearance, without changing the wrapper.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const fit = Math.max(0, Math.min(width - 32, (height - 44) * 1672 / 941));
      if (stage.current) { stage.current.style.width = `${fit}px`; stage.current.style.height = `${fit * 941 / 1672}px`; }
    });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(pointerFrame.current); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = frame.current;
        if (!node) return;
        const running = visible && !document.hidden && !reduced;
        node.dataset.running = String(running);
        node.getAnimations({ subtree: true }).forEach(animation => {
          if (animation.playState !== 'finished') { if (running) animation.play(); else animation.pause(); }
        });
        if (!running) { px.set(0); py.set(0); return; }
        const rect = node.getBoundingClientRect();
        const incoming = Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.min(rect.height, innerHeight * .65)));
        // The existing desktop showcase is sticky, so also follow its final scroll segment.
        const section = node.closest('section');
        const travel = section ? section.offsetHeight - innerHeight : 0;
        const sectionProgress = section && travel > 0 ? -section.getBoundingClientRect().top / travel : 1;
        const activeProgress = innerWidth >= 768 && travel > 0 ? Math.max(0, Math.min(1, (sectionProgress - 2 / 3) / .14)) : 1;
        progress.set(Math.min(incoming, activeProgress));
        const exposure = Math.max(0, Math.min(1, rect.bottom / Math.max(1, rect.height), (innerHeight - rect.top) / Math.max(1, rect.height)));
        node.style.setProperty('--exposure', String(exposure));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); document.removeEventListener('visibilitychange', update); };
  }, [visible, reduced, started, story, px, py, progress]);

  return <div ref={frame} className={`${layout.imageFrame} ${styles.frame}`} data-started={started} data-running={visible && !reduced} data-sitstick-image onPointerEnter={event => {
    if (started && !reduced && event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) setStory(value => value + 1);
  }} onPointerMove={event => {
    if (reduced || !visible || event.pointerType === 'touch' || !matchMedia('(min-width: 768px) and (hover: hover)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const factor = innerWidth <= 1050 ? .5 : 1;
    const nextX = (0.5 - (event.clientX - rect.left) / rect.width) * 8 * factor;
    const nextY = (0.5 - (event.clientY - rect.top) / rect.height) * 6 * factor;
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => { px.set(nextX); py.set(nextY); });
  }} onPointerLeave={() => { cancelAnimationFrame(pointerFrame.current); px.set(0); py.set(0); }}>
    <div ref={stage} className={styles.stage}>
      <motion.div className={styles.layer} style={{ y: reduced ? 0 : scrollY, opacity: reduced ? 1 : opacity, scale: reduced ? 1 : scale }}>
        <motion.div className={styles.layer} style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}>
          <div className={styles.hover}>
            <div className={styles.reveal}>
              <Image priority unoptimized src="/images/showcase/sitstick-watercolor.png" alt="Older adult resting on the SitStick portable mobility seat beside its compact walking-support form in an accessible park." fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'contain', objectPosition: 'center' }} onLoad={() => setStarted(true)} />
            </div>
            <div className={styles.environment} aria-hidden="true">
              <span className={styles.sun} /><span className={styles.shadow} />
              {[[12, 12], [24, 7], [32, 16], [57, 19], [16, 49]].map(([left, top], i) => <i key={i} className={styles.leaf} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${.3 + i * 1.3}s`, animationDuration: `${9 + i}s` }} />)}
            </div>
            <svg className={styles.sweep} viewBox="0 0 1672 941" aria-hidden="true"><path d="M1200 368 C1350 438 1080 530 844 670" pathLength="100" /></svg>
            <svg key={story} data-story={story} className={styles.story} style={{ animationDelay: story ? '0s' : '.7s' }} viewBox="0 0 1672 941" aria-hidden="true">
              <defs><radialGradient id={`sitstick-joint-${story}`}><stop stopColor="#d5ae58" /><stop offset="1" stopColor="#d5ae58" stopOpacity="0" /></radialGradient></defs>
              <circle className={styles.start} cx="1350" cy="466" r="4" />
              <path className={styles.trace} d="M1358 464 C1450 440 1545 470 1554 536 C1562 574 1532 582 1518 587" pathLength="100" />
              <circle className={styles.end} cx="1451" cy="598" r="4" />
              <ellipse className={styles.ripple} cx="1450" cy="859" rx="90" ry="16" />
              <g fill={`url(#sitstick-joint-${story})`} className={styles.joints}><circle cx="1305" cy="512" r="22" /><circle cx="1303" cy="738" r="20" /><circle cx="1451" cy="598" r="27" /></g>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>;
}
