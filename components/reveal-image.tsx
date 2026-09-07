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
    let enabled = true;
    let imageActive = false;
    let imageMuted = false;
    let disposed = false;
    let requestId = 0;
    let heroVisible = true;
    player.volume = 1;
    const publish = () => window.dispatchEvent(new CustomEvent('music-state', {
      detail: { playing: imageActive ? !player.paused : enabled, volume: player.volume },
    }));
    const stop = () => { ++requestId; player.pause(); player.currentTime = 0; };
    const play = async (background: boolean) => {
      if (!heroVisible || document.hidden || (background ? imageMuted : !enabled || imageActive)) return;
      stop();
      const id = requestId;
      const source = background ? '/jyoti-bengali-instrumental.mpeg' : '/hero-word-change.mp3';
      if (player.getAttribute('src') !== source) player.src = source;
      player.loop = background;
      try {
        await player.play();
        if (id !== requestId) return;
        if (disposed) { player.pause(); return; }
        remember('portfolio-music-activated');
        window.dispatchEvent(new Event('music-activated'));
        publish();
      } catch {
        if (id === requestId) { if (!background) enabled = false; publish(); }
      }
    };
    const restartText = () => window.dispatchEvent(new Event('hero-text-restart'));
    const toggle = () => {
      if (imageActive) {
        imageMuted = !imageMuted;
        if (imageMuted) stop(); else void play(true);
      } else {
        enabled = !enabled;
        if (enabled) restartText(); else stop();
      }
      publish();
    };
    const imageChanged = (event: Event) => {
      const next = (event as CustomEvent<{ playing: boolean }>).detail.playing;
      if (next === imageActive) return;
      imageActive = next;
      imageMuted = false;
      stop();
      if (imageActive) void play(true);
      else if (enabled) restartText();
      publish();
    };
    const changeVolume = (event: Event) => {
      const volume = (event as CustomEvent<{ volume: number }>).detail.volume;
      if (!Number.isFinite(volume)) return;
      player.volume = Math.max(0, Math.min(1, volume));
      publish();
    };
    const blankClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('#home')) return;
      if (target.closest('a, button, input, label, [role="button"], h1, h2, p, .hero-skills-marquee')) return;
      if (enabled) return;
      enabled = true;
      restartText();
      publish();
    };
    const wordChanged = () => { if (!imageActive) void play(false); };
    const visibility = () => { if (document.hidden) { stop(); publish(); } };
    const observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (!heroVisible) { stop(); publish(); }
    });
    const hero = document.getElementById('home');
    if (hero) observer.observe(hero);
    window.addEventListener('set-music-volume', changeVolume);
    window.addEventListener('toggle-music', toggle);
    window.addEventListener('hero-word-change', wordChanged);
    window.addEventListener('hero-music', imageChanged);
    document.addEventListener('click', blankClick);
    document.addEventListener('visibilitychange', visibility);
    // Attempt once at full volume. Rejection leaves MUSIC ready for a user click.
    void play(false);
    return () => {
      disposed = true; stop(); observer.disconnect();
      window.removeEventListener('set-music-volume', changeVolume);
      window.removeEventListener('toggle-music', toggle);
      window.removeEventListener('hero-word-change', wordChanged);
      window.removeEventListener('hero-music', imageChanged);
      document.removeEventListener('click', blankClick);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  // One player switches sources, so image music and word cues cannot overlap.
  // oxlint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={audio} src="/hero-word-change.mp3" preload="none" />;
}
