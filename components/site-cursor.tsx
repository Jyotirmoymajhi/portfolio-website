'use client';

import { useEffect, useRef } from 'react';

export function SiteCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursor.current;
    if (!node) return;
    const root = document.documentElement;
    const mouseAvailable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const hide = () => {
      node.style.opacity = '0';
      root.classList.remove('custom-cursor-active');
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !mouseAvailable.matches) {
        hide();
        return;
      }
      node.style.transform = `translate3d(${event.clientX - 11}px, ${event.clientY - 11}px, 0)`;
      node.style.opacity = '1';
      root.classList.add('custom-cursor-active');
    };
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) hide();
    };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerdown', move, true);
    document.addEventListener('pointerover', move, true);
    document.addEventListener('pointerout', leave, true);
    document.addEventListener('pointercancel', hide, true);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', hide);
    mouseAvailable.addEventListener('change', hide);
    return () => {
      hide();
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerdown', move, true);
      document.removeEventListener('pointerover', move, true);
      document.removeEventListener('pointerout', leave, true);
      document.removeEventListener('pointercancel', hide, true);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', hide);
      mouseAvailable.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={cursor} className="artwork-cursor site-cursor" aria-hidden="true"><span /></div>;
}
