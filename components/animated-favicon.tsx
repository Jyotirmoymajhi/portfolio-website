'use client';

import { useEffect } from 'react';

const frames = Array.from(
  { length: 30 },
  (_, index) => `/favicons/frames/favicon-${String(index + 1).padStart(2, '0')}.png`,
);

export function AnimatedFavicon() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;

    const fallback = link.getAttribute('href') ?? '/favicons/favicon.png';
    let disposed = false;
    let ready = false;
    let frame = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const images: HTMLImageElement[] = [];

    function pause() {
      if (interval !== undefined) clearInterval(interval);
      interval = undefined;
    }

    function updateVisibility() {
      pause();
      if (disposed || !ready || document.visibilityState !== 'visible') return;
      interval = setInterval(() => {
        link!.href = frames[frame];
        frame = (frame + 1) % frames.length;
      }, 1000 / 3);
    }

    document.addEventListener('visibilitychange', updateVisibility);
    Promise.all(
      frames.map((src) => new Promise<void>((resolve, reject) => {
        const image = new Image();
        images.push(image);
        image.onload = () => resolve();
        image.onerror = () => reject();
        image.src = src;
      })),
    ).then(() => {
      ready = true;
      updateVisibility();
    }).catch(() => {
      // Keep the static fallback if any frame cannot load.
    });

    return () => {
      disposed = true;
      pause();
      document.removeEventListener('visibilitychange', updateVisibility);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      link.setAttribute('href', fallback);
    };
  }, []);

  return null;
}
