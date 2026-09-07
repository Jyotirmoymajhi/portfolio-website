'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

function readSession(key: string) {
  try { return sessionStorage.getItem(key) === 'true'; } catch { return false; }
}
function remember(key: string) {
  try { sessionStorage.setItem(key, 'true'); } catch { /* Guidance still works without storage. */ }
}

export function RevealImage({ children, className, instructionId, hero = false }: {
  children: ReactNode; className: string; instructionId: string; hero?: boolean;
}) {
  const area = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [musicDismissed, setMusicDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const key = `portfolio-reveal-${instructionId}`;
  const dismiss = () => { setDismissed(true); remember(key); };
  useEffect(() => {
    const node = area.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= .35);
      setDismissed(readSession(key));
      setMusicDismissed(readSession('portfolio-music-activated'));
    }, { threshold: [0, .35] });
    observer.observe(node);
    const activated = () => setMusicDismissed(true);
    window.addEventListener('music-activated', activated);
    return () => { observer.disconnect(); window.removeEventListener('music-activated', activated); };
  }, [key]);
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Preserve the existing image container and its block-level image layers.
    <div ref={area} className={`${className} guided-image`} role="button" tabIndex={0}
      aria-label="Reveal image in colour" aria-pressed={hovered || focused || tapped}
      data-colour={hovered || focused || tapped}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        setHovered(true); dismiss();
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) { setFocused(true); dismiss(); }
      }}
      onBlur={() => { setFocused(false); setTapped(false); }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); setFocused(false); setTapped(value => !value); dismiss();
        }
        if (event.key === 'Escape') { setFocused(false); setTapped(false); }
      }}
      onPointerDown={(event) => { gesture.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={(event) => {
        const start = gesture.current;
        gesture.current = null;
        if (event.pointerType !== 'mouse' && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 10) {
          setTapped(value => !value); dismiss();
        }
      }}
      onClick={(event) => {
        // Assistive technology can dispatch a click without pointer events.
        if (event.detail === 0) { setFocused(false); setTapped(value => !value); dismiss(); }
      }}
    >
      {children}
      <div className="image-guidance" aria-hidden="true">
        <span className="image-instruction" data-visible={visible && !dismissed}>
          <span className="instruction-cursor" />
          <span className="instruction-desktop">HOVER TO REVEAL COLOUR</span>
          <span className="instruction-touch">TAP TO REVEAL COLOUR</span>
        </span>
        {hero && <span className="music-instruction" data-visible={visible && !musicDismissed}>
          <span className="instruction-dot" />CLICK MUSIC FOR SOUND
        </span>}
      </div>
    </div>
  );
}

export function PortfolioAudio() {
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    let enabled = false;
    let disposed = false;
    let requestId = 0;
    let heroVisible = true;
    player.volume = .14;
    const publish = () => window.dispatchEvent(new CustomEvent('music-state', {
      detail: { playing: enabled, volume: player.volume },
    }));
    const stop = () => { ++requestId; player.pause(); player.currentTime = 0; };
    const playCue = async () => {
      if (!enabled || !heroVisible || document.hidden) return;
      stop();
      const id = requestId;
      try {
        await player.play();
        if (disposed || !enabled) { player.pause(); return; }
        if (id !== requestId) return;
        remember('portfolio-music-activated');
        window.dispatchEvent(new Event('music-activated'));
      } catch {
        if (id === requestId) { enabled = false; publish(); }
      }
    };
    const toggle = () => {
      enabled = !enabled;
      publish();
      if (enabled) void playCue();
      else stop();
    };
    const wordChanged = () => { void playCue(); };
    const visibility = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (!heroVisible) stop();
    });
    const hero = document.getElementById('home');
    if (hero) observer.observe(hero);
    window.addEventListener('toggle-music', toggle);
    window.addEventListener('hero-word-change', wordChanged);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; stop(); observer.disconnect();
      window.removeEventListener('toggle-music', toggle);
      window.removeEventListener('hero-word-change', wordChanged);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  // The existing word-change cue plays only after MUSIC is explicitly enabled.
  // oxlint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={audio} src="/hero-word-change.mp3" preload="none" />;
}
