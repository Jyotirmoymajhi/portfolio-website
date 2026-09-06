'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Resets on refresh, but not on an internal navigation back to this page.
let loaderCompleted = false;
const contentSelector = '.ventry-right > *';

export function ProjectMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const percentage = useRef<HTMLOutputElement>(null);

  useLayoutEffect(() => {
    const scope = root.current;
    const overlay = loader.current;
    if (!scope || !overlay) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const projects = Array.from(
      scope.querySelectorAll<HTMLElement>('.ventry-project'),
    );
    const stage = scope.querySelector<HTMLElement>('.project-stage')!;
    let disposed = false;
    // If hydration arrived after the CSS safety exit, never cover the page again.
    let ready =
      loaderCompleted ||
      reduced.matches ||
      getComputedStyle(overlay).visibility === 'hidden';
    let unlocked = true;
    let master: gsap.core.Timeline | undefined;
    let deadline = 0;
    let assetDeadline = 0;
    let refreshFrame = 0;
    let releaseAssets = () => {};
    let followProjectHash = () => {};
    let initialHashPending = true;
    const entrances: { element: HTMLElement; timeline: gsap.core.Timeline }[] =
      [];
    const media = gsap.matchMedia();
    const html = document.documentElement;
    const body = document.body;
    const original = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      gutter: html.style.scrollbarGutter,
      padding: body.style.paddingRight,
      x: window.scrollX,
      y: window.scrollY,
    };
    const pageElements = Array.from(
      document.querySelectorAll<HTMLElement>('header, main, footer'),
    );
    const priorInert = pageElements.map((element) => element.inert);

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      html.style.overflow = original.htmlOverflow;
      body.style.overflow = original.bodyOverflow;
      html.style.scrollbarGutter = original.gutter;
      body.style.paddingRight = original.padding;
      pageElements.forEach((element, i) => {
        element.inert = priorInert[i];
      });
      window.scrollTo({
        left: original.x,
        top: original.y,
        behavior: 'instant',
      });
    };
    const refresh = () => {
      if (disposed) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (ready && unlocked && initialHashPending) {
          initialHashPending = false;
          followProjectHash();
        }
      });
    };
    const revealVisibleProjects = () => {
      entrances.forEach(({ element, timeline }) => {
        if (ScrollTrigger.isInViewport(element)) timeline.play();
      });
    };
    const finish = () => {
      window.clearTimeout(deadline);
      window.clearTimeout(assetDeadline);
      overlay.removeAttribute('data-active');
      overlay.dataset.complete = 'true';
      unlock();
      if (disposed) return;
      ready = true;
      loaderCompleted = true;
      revealVisibleProjects();
      refresh();
    };
    const onReducedMotion = () => {
      if (reduced.matches) {
        master?.kill();
        finish();
      }
    };

    const ctx = gsap.context(() => {
      media.add(
        {
          desktop: '(min-width: 768px) and (min-height: 740px)',
          flow: '(max-width: 767px), (max-height: 739px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (context.conditions?.reduce) return;
          const desktop = Boolean(context.conditions?.desktop);
          scope.classList.toggle('is-pinned', desktop);
          const navHeight = () =>
            document.querySelector('header')?.getBoundingClientRect().height ||
            76;
          const setNavHeight = () =>
            scope.style.setProperty('--project-nav-height', `${navHeight()}px`);
          setNavHeight();
          ScrollTrigger.addEventListener('refreshInit', setNavHeight);

          // Intro motion uses an inner image layer so the scrub timeline can
          // independently animate the artwork without competing transforms.
          const introProjects = desktop ? projects.slice(0, 1) : projects;
          introProjects.forEach((project) => {
            const intro = gsap.timeline({ paused: true });
            intro.fromTo(
              project.querySelector('.project-image-entrance'),
              {
                opacity: desktop ? 0.35 : 0.6,
                filter: `blur(${desktop ? 10 : 3}px)`,
                scale: 1.02,
              },
              {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
              },
              0,
            );
            intro.fromTo(
              project.querySelectorAll(contentSelector),
              { opacity: 0, y: desktop ? 18 : 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
              },
              0.16,
            );
            entrances.push({ element: project, timeline: intro });
            ScrollTrigger.create({
              trigger: project,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                if (ready) intro.play();
              },
            });
            // Focused links must never remain invisible when reached by keyboard.
            const showOnFocus = () => intro.progress(1);
            project.addEventListener('focusin', showOnFocus);
            context.add(
              () => () => project.removeEventListener('focusin', showOnFocus),
            );
          });

          if (desktop) {
            const [ventry, tavvro] = projects;
            const ventryImage = ventry.querySelector('.ventry-artwork');
            const tavvroImage = tavvro.querySelector('.ventry-artwork');
            const tavvroContent = tavvro.querySelectorAll(contentSelector);
            gsap.set(tavvroImage, {
              opacity: 0,
              filter: 'blur(14px)',
              scale: 1.04,
              y: 35,
              '--watercolor-reveal': '0%',
            });
            gsap.set(tavvroContent, { autoAlpha: 0, y: 20 });
            let activeProject = -1;
            const syncAccess = (progress: number) => {
              const next = progress < 0.52 ? 0 : 1;
              if (next === activeProject) return;
              activeProject = next;
              projects.forEach((project, index) => {
                const hidden = index !== next;
                project.inert = hidden;
                project.setAttribute('aria-hidden', String(hidden));
                project.style.pointerEvents = hidden ? 'none' : 'auto';
                project.style.zIndex = hidden ? '0' : '1';
              });
            };
            const transition = gsap.timeline({
              defaults: { ease: 'none' },
              onUpdate: () => syncAccess(transition.progress()),
              scrollTrigger: {
                id: 'portfolio-project-transition',
                trigger: stage,
                start: () => `top top+=${navHeight()}`,
                end: () => `+=${window.innerHeight * 1.8}`,
                pin: true,
                scrub: 0.45,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
            // One normalized 0–1 timeline; overlap prevents an empty paper frame.
            transition
              .to(
                ventry.querySelector('.ventry-right'),
                { autoAlpha: 0, y: -24, duration: 0.27 },
                0.15,
              )
              .to(
                ventryImage,
                {
                  opacity: 0,
                  filter: 'blur(12px)',
                  scale: 0.97,
                  y: -30,
                  duration: 0.37,
                },
                0.25,
              )
              .to(
                tavvroImage,
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  scale: 1,
                  y: 0,
                  '--watercolor-reveal': '160%',
                  duration: 0.32,
                },
                0.38,
              )
              .to(
                tavvroContent,
                { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.02 },
                0.58,
              )
              .to({}, { duration: 0.18 }, 0.82);
            syncAccess(transition.progress());

            // Preserve direct project anchors despite their shared pinned stage.
            const followHash = () => {
              const trigger = transition.scrollTrigger;
              if (
                !trigger ||
                !['#ventry', '#tavvro'].includes(window.location.hash)
              )
                return;
              const progress = window.location.hash === '#tavvro' ? 0.9 : 0;
              window.scrollTo({
                top: trigger.start + (trigger.end - trigger.start) * progress,
                behavior: 'instant',
              });
            };
            window.addEventListener('hashchange', followHash);
            followProjectHash = followHash;
            context.add(
              () => () => window.removeEventListener('hashchange', followHash),
            );
          }
          if (ready) revealVisibleProjects();
          return () => {
            ScrollTrigger.removeEventListener('refreshInit', setNavHeight);
            entrances.length = 0;
            scope.classList.remove('is-pinned');
            followProjectHash = () => {};
            scope.style.removeProperty('--project-nav-height');
            projects.forEach((project) => {
              project.inert = false;
              project.removeAttribute('aria-hidden');
              project.style.removeProperty('pointer-events');
              project.style.removeProperty('z-index');
            });
          };
        },
      );

      if (ready) {
        overlay.dataset.complete = 'true';
        loaderCompleted = true;
        return;
      }
      unlocked = false;
      const scrollbar = window.innerWidth - html.clientWidth;
      if (CSS.supports('scrollbar-gutter', 'stable'))
        html.style.scrollbarGutter = 'stable';
      else
        body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      pageElements.forEach((element) => {
        element.inert = true;
      });
      overlay.removeAttribute('data-complete');
      overlay.dataset.active = 'true';
      if (percentage.current) percentage.current.textContent = '00%';
      const progress = { value: 0 };
      let assetsReady = false;
      master = gsap.timeline({ onComplete: finish });
      master
        .to(
          progress,
          {
            value: 90,
            duration: 0.95,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (percentage.current)
                percentage.current.textContent = `${Math.floor(progress.value).toString().padStart(2, '0')}%`;
            },
          },
          0,
        )
        .fromTo(
          overlay.querySelector('.project-loader-art'),
          {
            opacity: 0,
            filter: 'blur(18px)',
            scale: 1.05,
            '--loader-reveal': '0%',
          },
          {
            opacity: 0.35,
            filter: 'blur(5px)',
            scale: 1.02,
            '--loader-reveal': '100%',
            duration: 1.15,
            ease: 'power1.out',
          },
          0,
        )
        .addPause(0.95, () => {
          if (assetsReady) master?.resume();
        })
        .to(
          progress,
          {
            value: 100,
            duration: 0.15,
            ease: 'power1.out',
            onUpdate: () => {
              if (percentage.current)
                percentage.current.textContent = `${Math.round(progress.value)}%`;
            },
          },
          0.95,
        )
        .to(
          overlay.querySelector('.project-loader-copy'),
          { opacity: 0, y: -16, duration: 0.32 },
          1.3,
        )
        .to(
          overlay,
          {
            '--loader-exit': '125%',
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          1.3,
        )
        .call(
          () => {
            ready = true;
            revealVisibleProjects();
          },
          [],
          1.3,
        );
      releaseAssets = () => {
        if (disposed || assetsReady) return;
        assetsReady = true;
        if (master?.paused()) master.resume();
      };
      // Asset wait ends at 1.7s, leaving 1.15s for completion/exit under 3s.
      assetDeadline = window.setTimeout(releaseAssets, 1700);
      deadline = window.setTimeout(() => {
        master?.kill();
        finish();
      }, 3000);
    }, scope);

    // Only first-project assets block the loader; fonts and other images refresh
    // measurements independently and can never hold the white layer open.
    const essentialImages = Array.from(
      scope.querySelectorAll<HTMLImageElement>('#ventry img'),
    );
    void Promise.allSettled(
      essentialImages.map((image) => image.decode()),
    ).then(releaseAssets);
    const images = Array.from(document.images);
    images.forEach((image) => image.addEventListener('load', refresh));
    void document.fonts.ready.then(refresh);
    window.addEventListener('resize', refresh);
    reduced.addEventListener('change', onReducedMotion);
    refresh();

    return () => {
      disposed = true;
      window.clearTimeout(deadline);
      window.clearTimeout(assetDeadline);
      cancelAnimationFrame(refreshFrame);
      reduced.removeEventListener('change', onReducedMotion);
      window.removeEventListener('resize', refresh);
      images.forEach((image) => image.removeEventListener('load', refresh));
      master?.kill();
      media.revert();
      ctx.revert();
      overlay.removeAttribute('data-active');
      overlay.dataset.complete = 'true';
      unlock();
    };
  }, []);

  return (
    <div className="projects-motion" ref={root}>
      <div className="project-loader" ref={loader} aria-hidden="true">
        <div className="project-loader-art" />
        <div className="project-loader-copy">
          <span>SELECTED WORK</span>
          <output ref={percentage}>00%</output>
        </div>
      </div>
      <div className="project-stage">{children}</div>
    </div>
  );
}
