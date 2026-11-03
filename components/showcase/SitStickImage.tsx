'use client';

import Image from 'next/image';
import { useInView, useReducedMotion } from 'motion/react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import layout from './ProjectShowcase.module.css';
import styles from './SitStickImage.module.css';

const artwork = '/images/showcase/sitstick-watercolor.png';
// Source-pixel centres sampled from existing flowers; every patch shares the base image.
const flowers = [
  [374, 500, 40, 40, 'coral'], [293, 530, 40, 40, 'white'],
  [328, 526, 36, 36, 'coral'], [273, 559, 38, 38, 'pink'],
  [246, 517, 39, 39, 'white'], [303, 486, 42, 42, 'coral'],
  [196, 511, 42, 42, 'white'], [223, 447, 35, 35, 'pink'],
  [101, 529, 35, 35, 'yellow'],
] as const;
const plants = [[293, 413, 28, 98], [320, 403, 30, 94], [183, 574, 30, 100]] as const;
const canopy = [[181, 103, 28, 34], [359, 215, 27, 32], [500, 53, 30, 30]] as const;

function patch(x: number, y: number, width: number, height: number): CSSProperties {
  return {
    left: `${(x - width / 2) / 1672 * 100}%`, top: `${(y - height / 2) / 941 * 100}%`,
    width: `${width / 1672 * 100}%`, height: `${height / 941 * 100}%`,
    '--patch-size': `${1672 / width * 100}% ${941 / height * 100}%`,
    '--patch-position': `${(x - width / 2) / (1672 - width) * 100}% ${(y - height / 2) / (941 - height) * 100}%`,
  } as CSSProperties;
}

export function SitStickImage() {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(frame);
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const fit = Math.max(0, Math.min(width - 32, (height - 44) * 1672 / 941));
      if (stage.current) { stage.current.style.width = `${fit}px`; stage.current.style.height = `${fit * 941 / 1672}px`; }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const node = frame.current;
      if (!node) return;
      const running = started && visible && !document.hidden && !reduced;
      node.dataset.running = String(running);
      // CSS timelines retain their progress while paused; finished blooms never restart.
      node.getAnimations({ subtree: true }).forEach(animation => {
        if (animation.playState !== 'finished') { if (running) animation.play(); else animation.pause(); }
      });
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [visible, reduced, started]);

  const hover = (active: boolean) => {
    const node = frame.current;
    if (!node || reduced || !matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) return;
    node.dataset.hover = String(active);
    node.querySelectorAll('[data-breeze]').forEach(el => el.getAnimations().forEach(animation => animation.updatePlaybackRate(active ? 1.15 : 1)));
    if (active && node.dataset.running === 'true') {
      // Reuse the coral petal instead of adding another particle. The other two
      // have disjoint time windows, so even on hover at most two petals appear.
      node.querySelector('[data-petal]')?.getAnimations().forEach(animation => { animation.currentTime = 0; });
    }
  };

  return <div ref={frame} className={`${layout.imageFrame} ${styles.frame}`} data-started={started} data-running={visible && started && !reduced} data-sitstick-image onPointerEnter={event => { if (event.pointerType !== 'touch') hover(true); }} onPointerLeave={() => hover(false)}>
    <div ref={stage} className={styles.stage}>
      <div className={styles.entrance}>
        <div className={styles.hover}>
          <Image priority unoptimized src={artwork} alt="Older adult resting on the SitStick portable mobility seat beside its compact walking-support form in an accessible park." fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'contain', objectPosition: 'center' }} onLoad={() => setStarted(true)} />
          <div className={styles.garden} data-garden aria-hidden="true">
            {plants.map(([x, y, w, h], i) => <div key={i} className={styles.plant} data-plant style={{ ...patch(x, y, w, h), '--delay': `${.65 + i * .1}s`, '--duration': `${5.8 + i * .9}s` } as CSSProperties}><div className={styles.growth}><div className={`${styles.patch} ${styles.leafBreeze}`} data-breeze /></div></div>)}
            {flowers.map(([x, y, w, h, color], i) => <div key={i} className={styles.flower} data-flower={color} style={{ ...patch(x, y, w, h), '--delay': `${.35 + i * .1}s`, '--breeze-delay': `${1 + i * .1}s`, '--duration': `${4.3 + i * .29}s` } as CSSProperties}><div className={styles.bloom}><div className={styles.flowerHover}><div className={`${styles.patch} ${styles.flowerBreeze}`} data-breeze /></div></div></div>)}
            {canopy.map(([x, y, w, h], i) => <div key={i} className={styles.canopy} data-tree style={{ ...patch(x, y, w, h), '--duration': `${7.6 + i * 1.4}s` } as CSSProperties}><div className={`${styles.patch} ${styles.treeBreeze}`} data-breeze /></div>)}
            {[['coral', 22, 53, 0], ['white', 12, 55, 9], ['yellow', 16, 46, 18]].map(([color, left, top, delay]) => <i key={color} data-petal={color} className={styles.petal} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }} />)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}
