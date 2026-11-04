'use client';

import Image from 'next/image';
import { useInView, useIsPresent, useReducedMotion } from 'motion/react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import layout from './ProjectShowcase.module.css';
import styles from './SitStickImage.module.css';

const artwork = '/images/showcase/sitstick-watercolor.png';
// Masks use original 1672 × 941 coordinates. Every layer contains the complete,
// identically fitted source image; no cropped pieces are resized or redrawn.
const savedTimes = new Map<string, number>();
const regions = [
  { name: 'flowers-coral', kind: 'flower', origin: [324, 577], duration: 2.6, delay: 0, left: -3, right: 4, tiltLeft: -2, tiltRight: 2.5, rise: -1.5, tier: 1 },
  { name: 'flowers-white', kind: 'flower', origin: [245, 553], duration: 2.9, delay: 0.18, left: 3, right: -4, tiltLeft: 2, tiltRight: -2.4, rise: -1, tier: 2 },
  { name: 'flowers-middle', kind: 'flower', origin: [217, 575], duration: 3.1, delay: 0.35, left: -3, right: 3.5, tiltLeft: -2, tiltRight: 2.2, rise: -0.6, tier: 2 },
  { name: 'flowers-small', kind: 'flower', origin: [255, 479], duration: 3.4, delay: 0.5, left: 2, right: -3, tiltLeft: 1.3, tiltRight: -1.7, rise: -0.3, tier: 3 },
  { name: 'long-leaves-a', kind: 'long-leaf', origin: [294, 459], duration: 2.8, delay: 0, left: -2, right: 3, tiltLeft: -2, tiltRight: 2.3, rise: 0, tier: 2 },
  { name: 'long-leaves-b', kind: 'long-leaf', origin: [328, 463], duration: 3.2, delay: 0.25, left: 2, right: -2.5, tiltLeft: 1.8, tiltRight: -2, rise: 0, tier: 2 },
  { name: 'long-leaves-c', kind: 'long-leaf', origin: [178, 620], duration: 3.4, delay: 0.45, left: -1.5, right: 2, tiltLeft: -1.5, tiltRight: 1.8, rise: 0, tier: 3 },
  { name: 'tree-left-a', kind: 'tree', origin: [168, 94], duration: 2.9, delay: 0, left: -3, right: 4, tiltLeft: -1.5, tiltRight: 1.8, rise: -1, tier: 1 },
  { name: 'tree-left-b', kind: 'tree', origin: [362, 202], duration: 3.3, delay: 0.2, left: 3, right: -3, tiltLeft: 1.4, tiltRight: -1.6, rise: 0, tier: 2 },
  { name: 'tree-left-c', kind: 'tree', origin: [505, 51], duration: 3.7, delay: 0.4, left: -2.5, right: 3.5, tiltLeft: -1.2, tiltRight: 1.5, rise: 0, tier: 3 },
  { name: 'tree-near', kind: 'tree', origin: [579, 110], duration: 4, delay: 0.6, left: -2, right: 2, tiltLeft: -1, tiltRight: 1, rise: 0, tier: 3 },
  { name: 'tree-background', kind: 'background', origin: [908, 173], duration: 3.8, delay: 0, left: -2, right: 2, tiltLeft: -0.8, tiltRight: 0.9, rise: 0, tier: 2 },
  { name: 'tree-background-b', kind: 'background', origin: [1020, 268], duration: 4.3, delay: 0.35, left: 2, right: -2, tiltLeft: 0.7, tiltRight: -0.8, rise: 0, tier: 3 },
  { name: 'tree-background-c', kind: 'background', origin: [1200, 305], duration: 4.8, delay: 0.6, left: -1.5, right: 1.5, tiltLeft: -0.6, tiltRight: 0.6, rise: 0, tier: 3 },
  { name: 'path-flowers-a', kind: 'path', origin: [855, 428], duration: 2.7, delay: 0.2, left: -2, right: 2, tiltLeft: -1.2, tiltRight: 1.2, rise: -0.4, tier: 2 },
  { name: 'path-flowers-b', kind: 'path', origin: [875, 465], duration: 3.2, delay: 0.45, left: 2, right: -2, tiltLeft: 1.2, tiltRight: -1.2, rise: -0.3, tier: 2 },
] as const;

export function SitStickImage() {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const triggered = useInView(frame, { amount: .4, once: true });
  const visible = useInView(frame, { amount: 'some' });
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const restored = useRef(false);
  const [loaded, setLoaded] = useState(false);

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
      const activated = loaded && triggered && !reduced;
      node.classList.toggle(styles.active, activated);
      node.dataset.started = String(loaded && triggered);
      node.dataset.running = String(activated && present && visible && !document.hidden);
      if (!activated || !present) node.dataset.hover = 'false';
      if (activated && !restored.current) {
        node.querySelectorAll<HTMLElement>('[data-motion]').forEach(el => el.getAnimations().forEach(a => {
          const time = savedTimes.get(el.dataset.motion!);
          if (time !== undefined) a.currentTime = time;
        }));
        restored.current = true;
      }
      if (!present) node.querySelectorAll<HTMLElement>('[data-motion]').forEach(el => el.getAnimations().forEach(a => savedTimes.set(el.dataset.motion!, Number(a.currentTime ?? 0))));
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [loaded, triggered, visible, present, reduced]);

  const hover = (active: boolean) => {
    const node = frame.current;
    if (!node || reduced || !present || !matchMedia('(min-width: 1051px) and (hover: hover) and (pointer: fine)').matches) return;
    node.dataset.hover = String(active);
    node.querySelectorAll('[data-motion]').forEach(el => el.getAnimations().forEach(animation => animation.updatePlaybackRate(active ? 1.1 : 1)));
  };

  return <div ref={frame} className={`${layout.imageFrame} ${styles.frame}`} data-sitstick-image data-present={present} data-running="false" data-started="false" onPointerEnter={event => { if (event.pointerType !== 'touch') hover(true); }} onPointerLeave={() => hover(false)}>
    <div ref={stage} className={styles.stage} data-artwork-stage>
      <Image data-base-image priority unoptimized src={artwork} alt="Older adult resting on the SitStick portable mobility seat beside its compact walking-support form in an accessible park." fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'contain', objectPosition: 'center' }} onLoad={() => setLoaded(true)} />
      <div className={styles.garden} data-garden aria-hidden="true">
        {regions.map(region => <div key={region.name} className={styles.region} data-region={region.name} data-kind={region.kind} data-tier={region.tier} style={{
          maskImage: `url('/images/showcase/sitstick-breeze/${region.name}.svg')`,
          '--origin': `${region.origin[0] / 1672 * 100}% ${region.origin[1] / 941 * 100}%`,
          '--duration': `${region.duration}s`, '--delay': `${region.delay}s`,
          '--left': `${region.left}px`, '--right': `${region.right}px`, '--tilt-left': `${region.tiltLeft}deg`, '--tilt-right': `${region.tiltRight}deg`, '--rise': `${region.rise}px`,
        } as CSSProperties}>
          <div className={styles.motion} data-motion={region.name}><Image unoptimized src={artwork} alt="" fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'contain', objectPosition: 'center' }} /></div>
        </div>)}
        {['breathing', 'vest', 'blink', 'shadow', 'brass'].map(name => <div key={name} className={styles.detail} data-detail={name} style={{maskImage: `url('/images/showcase/sitstick-breeze/${name}.svg')`}}>
          <div className={styles.detailMotion} data-motion={name === 'brass' ? undefined : name}>
            <Image unoptimized src={artwork} alt="" fill sizes="(max-width: 767px) 94vw, 65vw" style={{ objectFit: 'contain', objectPosition: 'center' }} />
          </div>
        </div>)}
      </div>
    </div>
  </div>;
}
