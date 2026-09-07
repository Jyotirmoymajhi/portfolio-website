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
    let requested = false;
    let disposed = false;
    try {
      const saved = Number(sessionStorage.getItem('jyoti-music-volume'));
      player.volume = saved >= .05 && saved <= .5 ? saved : .14;
    } catch { player.volume = .14; }
    const publish = () => window.dispatchEvent(new CustomEvent('music-state', {
      detail: { playing: !player.paused, volume: player.volume },
    }));
    let requestId = 0;
    const playback = async (playing: boolean) => {
      const id = ++requestId;
      requested = playing;
      if (!playing) { player.pause(); publish(); return; }
      try {
        await player.play();
        if (disposed || !requested) { player.pause(); return; }
        if (id !== requestId) return;
        remember('portfolio-music-activated');
        window.dispatchEvent(new Event('music-activated'));
      } catch {
        if (id === requestId) { requested = false; publish(); }
      }
    };
    const toggle = () => { void playback(!requested); };
    const heroPlayback = (event: Event) => {
      void playback((event as CustomEvent<{ playing: boolean }>).detail.playing);
    };
    const volume = (event: Event) => {
      const value = (event as CustomEvent<{ volume: number }>).detail.volume;
      if (!Number.isFinite(value)) return;
      player.volume = Math.max(.05, Math.min(.5, value));
      try { sessionStorage.setItem('jyoti-music-volume', String(player.volume)); } catch { /* Optional preference. */ }
      publish();
    };
    player.addEventListener('play', publish);
    player.addEventListener('pause', publish);
    window.addEventListener('hero-music', heroPlayback);
    window.addEventListener('toggle-music', toggle);
    window.addEventListener('set-music-volume', volume);
    return () => {
      disposed = true; player.pause();
      player.removeEventListener('play', publish); player.removeEventListener('pause', publish);
      window.removeEventListener('hero-music', heroPlayback);
      window.removeEventListener('toggle-music', toggle); window.removeEventListener('set-music-volume', volume);
    };
  }, []);
  // Existing instrumental track, shared by the entire portfolio; never autoplay.
  // oxlint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={audio} src="/jyoti-bengali-instrumental.mpeg" preload="none" loop />;
}
