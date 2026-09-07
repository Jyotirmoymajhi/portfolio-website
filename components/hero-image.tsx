'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroImage() {
  const [active, setActive] = useState(false);
  const image = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 46 });
  const current = useRef({ x: 50, y: 46 });
  const frame = useRef(0);
  const reduced = useRef(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reduced.current = preference.matches; };
    update();
    preference.addEventListener('change', update);
    return () => { preference.removeEventListener('change', update); cancelAnimationFrame(frame.current); };
  }, []);
  const position = (clientX: number, clientY: number, immediate = false) => {
    const node = image.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    target.current = {
      x: Math.max(0, Math.min(100, (clientX - bounds.left) / bounds.width * 100)),
      y: Math.max(0, Math.min(100, (clientY - bounds.top) / bounds.height * 100)),
    };
    if (frame.current && !immediate && !reduced.current) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    let previous = performance.now();
    const tick = (time: number) => {
      frame.current = 0;
      const ease = immediate || reduced.current ? 1 : 1 - Math.exp(-Math.max(0, Math.min(time - previous, 64)) / 95);
      previous = time;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      node.style.setProperty('--spot-x', current.current.x + '%');
      node.style.setProperty('--spot-y', current.current.y + '%');
      if (Math.hypot(target.current.x - current.current.x, target.current.y - current.current.y) > .015)
        frame.current = requestAnimationFrame(tick);
    };
    if (immediate || reduced.current) tick(previous);
    else frame.current = requestAnimationFrame(tick);
  };
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const change = (revealed: boolean) => {
    setActive(revealed);
  };
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Retain the original image container with its block-level layers and geometry.
    <div ref={image} className="hero-images hero-hover-image hero-spotlight-image" role="button" tabIndex={0}
      aria-label="Reveal image in colour" aria-pressed={active}
      data-colour={active}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') { position(event.clientX, event.clientY, true); change(true); } }}
      onPointerMove={(event) => { if (event.pointerType === 'mouse') position(event.clientX, event.clientY); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') { cancelAnimationFrame(frame.current); frame.current = 0; change(false); } }}
      onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) {
        const bounds = event.currentTarget.getBoundingClientRect();
        position(bounds.left + bounds.width / 2, bounds.top + bounds.height * .46, true);
        change(true);
      } }}
      onBlur={() => change(false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); change(!active); }
        if (event.key === 'Escape') change(false);
      }}
      onPointerDown={(event) => { touchStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { touchStart.current = null; }}
      onPointerUp={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (event.pointerType !== 'mouse' && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 10) { position(event.clientX, event.clientY, true); change(!active); }
      }}
      onClick={(event) => {
        if (event.detail === 0) change(!active);
      }}
    >
      <div className="hero-image hero-mono" />
      <div className="hero-image hero-color" />
      <div className="artwork-cursor" aria-hidden="true"><span /></div>
    </div>
  );
}
