'use client';

import { useEffect, useRef } from 'react';

export function SiteCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursor.current;
    if (!node) return;
    const root = document.documentElement;
    const mouseAvailable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pop: Animation | undefined;
    const hide = () => {
      pop?.cancel();
      node.dataset.interactive = 'false';
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
      node.dataset.interactive = String(event.target instanceof Element && !!event.target.closest('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [role="button"], summary'));
      root.classList.add('custom-cursor-active');
    };
    const press = (event: PointerEvent) => {
      move(event);
      if (event.pointerType !== 'mouse' || !mouseAvailable.matches || reducedMotion.matches) return;
      pop?.cancel();
      const scale = node.dataset.interactive === 'true' ? 1.25 : 1;
      pop = node.animate([
        { scale: String(scale), boxShadow: '0 0 0 0 rgb(240 74 19 / 0)' },
        { scale: '.75', boxShadow: '0 0 0 0 rgb(240 74 19 / .4)', offset: .2 },
        { scale: '1.55', boxShadow: '0 0 0 9px rgb(240 74 19 / 0)', offset: .65 },
        { scale: String(scale), boxShadow: '0 0 0 12px rgb(240 74 19 / 0)' },
      ], { duration: 360, easing: 'ease-out' });
    };
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) hide();
    };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerdown', press, true);
    document.addEventListener('pointerover', move, true);
    document.addEventListener('pointerout', leave, true);
    document.addEventListener('pointercancel', hide, true);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', hide);
    mouseAvailable.addEventListener('change', hide);
    return () => {
      hide();
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerdown', press, true);
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
