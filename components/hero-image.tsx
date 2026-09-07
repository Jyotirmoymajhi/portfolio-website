'use client';

import { useRef, useState } from 'react';

export function HeroImage() {
  const [active, setActive] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const change = (revealed: boolean) => {
    setActive(revealed);
    window.dispatchEvent(new CustomEvent('hero-music', { detail: { playing: revealed } }));
  };
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Retain the original image container with its block-level layers and geometry.
    <div className="hero-images hero-hover-image" role="button" tabIndex={0}
      aria-label="Reveal colour and play background music" aria-pressed={active}
      data-colour={active}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') change(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') change(false); }}
      onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) change(true); }}
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
        if (event.pointerType !== 'mouse' && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 10) change(!active);
      }}
      onClick={(event) => {
        if (event.detail === 0) change(!active);
        // A real click can unlock audio after the browser rejected hover playback.
        else if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === 'mouse' && active)
          window.dispatchEvent(new CustomEvent('hero-music', { detail: { playing: true } }));
      }}
    >
      <div className="hero-image hero-mono" />
      <div className="hero-image hero-color" />
      <div className="artwork-cursor" aria-hidden="true"><span /></div>
    </div>
  );
}
