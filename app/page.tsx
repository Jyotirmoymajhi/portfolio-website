'use client';
/* Instrumental audio contains no speech; native images preserve paired reveal geometry. */
/* oxlint-disable jsx-a11y/media-has-caption, next/no-img-element */
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GitBranch,
  Image as ImageIcon,
  LayoutGrid,
  MapPin,
  MousePointer2,
  Palette,
  PenTool,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProjectMotion } from '@/components/project-motion';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
function About() {
  return (
    <section id="about" className="about section-pad">
      <div className="section-kicker light">
        <span>02</span>
        <p>Beyond the pixels</p>
        <small>Kolkata, India</small>
      </div>
      <div className="about-grid">
        <h2>
          I design with
          <br />
          <em>curiosity, care</em>
          <br />
          and conviction.
        </h2>
        <div>
          <p className="about-lead">
            I’m interested in the quiet details that change how something feels
            — the right question, the rhythm of a screen, the story behind a
            system.
          </p>
          <p>
            Growing up in Kolkata taught me to see beauty in layers: old and
            new, ordered and beautifully chaotic. That perspective travels into
            every product I shape.
          </p>
          <a href="#contact" className="light-link">
            More about my journey <ArrowUpRight />
          </a>
        </div>
      </div>
      <div className="stats">
        {[
          ['05+', 'Years of making'],
          ['18', 'Projects shipped'],
          ['12', 'Research methods'],
          ['01', 'Human at the centre'],
        ].map((x) => (
          <div key={x[1]}>
            <strong>{x[0]}</strong>
            <span>{x[1]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function Experience() {
  return (
    <section id="experience" className="experience section-pad">
      <div className="section-kicker">
        <span>03</span>
        <p>Experience & approach</p>
        <small>Always learning</small>
      </div>
      <div className="experience-grid">
        <h2>
          From ambiguity
          <br />
          to <em>clarity.</em>
        </h2>
        <div className="timeline">
          {[
            [
              'Listen closely',
              'Research, context and the questions behind the brief.',
            ],
            [
              'Find the signal',
              'Turn observations into a focused opportunity.',
            ],
            [
              'Make it visible',
              'Prototype the system, interaction and story together.',
            ],
            [
              'Learn in reality',
              'Ship thoughtfully, measure and keep improving.',
            ],
          ].map((x, i) => (
            <div className="timeline-row" key={x[0]}>
              <span>0{i + 1}</span>
              <h3>{x[0]}</h3>
              <p>{x[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer id="contact" className="footer section-pad">
      <Sparkles />
      <p>Have a thoughtful problem?</p>
      <h2>
        Let’s make something
        <br />
        <em>meaningful.</em>
      </h2>
      <a href="mailto:hello@jyotirmoy.work">
        hello@jyotirmoy.work <ArrowUpRight />
      </a>
      <div className="footer-bottom">
        <span>© 2026 Jyotirmoy Majhi</span>
        <span>Designed with care in Kolkata</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
function Overlays() {
  const [o, setO] = useState<null | 'about' | 'kolkata'>(null);
  useEffect(() => {
    const a = () => setO('about'),
      k = () => setO('kolkata');
    window.addEventListener('open-about', a);
    window.addEventListener('open-kolkata', k);
    return () => {
      window.removeEventListener('open-about', a);
      window.removeEventListener('open-kolkata', k);
    };
  }, []);
  return (
    <Dialog
      open={o !== null}
      onOpenChange={(open) => {
        if (!open) setO(null);
      }}
    >
      <DialogContent
        className="overlay"
        showCloseButton={false}
        style={{
          top: 0,
          left: 0,
          transform: 'none',
          maxWidth: 'none',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          overflowY: 'auto',
        }}
      >
        <DialogClose className="overlay-close">Close</DialogClose>
        <div className="overlay-inner">
          {o === 'about' ? (
            <>
              <BriefcaseBusiness />
              <small>ABOUT JYOTIRMOY</small>
              <DialogTitle>
                A designer who believes clarity can still have soul.
              </DialogTitle>
              <p>
                I move between product strategy, visual design and research —
                looking for the human thread that helps the whole experience
                make sense.
              </p>
            </>
          ) : (
            <>
              <MapPin />
              <small>CITY OF JOY</small>
              <DialogTitle>Kolkata taught me to design in layers.</DialogTitle>
              <p>
                Heritage beside momentum. Precise craft beside beautiful
                improvisation. The city is part of how I observe, connect and
                create.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
const animatedWords = [
  { text: 'impact.', color: '#f04a13' },
  { text: 'meaning.', color: '#2f8f62' },
  { text: 'experiences.', color: '#3977bd' },
  { text: 'possibilities.', color: '#7a59a8' },
  { text: 'reality.', color: '#d14f3f' },
];
function ReferenceHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const hero = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const artCursor = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const ambientAudio = useRef<HTMLAudioElement>(null);
  const target = useRef({ x: 55, y: 46 });
  const current = useRef({ x: 55, y: 46 });
  const insideArtwork = useRef(false);
  const heroVisible = useRef(true);
  const audioUnlocked = useRef(false);
  const manuallyPaused = useRef(false);
  const fadeFrame = useRef(0);
  const wordTimer = useRef(0);
  const preferredVolume = useRef(0.14);

  const publishMusicState = () => {
    window.dispatchEvent(
      new CustomEvent('music-state', {
        detail: {
          playing: Boolean(
            (audio.current && !audio.current.paused) ||
            (ambientAudio.current && !ambientAudio.current.paused),
          ),
          volume: preferredVolume.current,
        },
      }),
    );
  };

  const playWordChangeSound = async () => {
    const player = audio.current;
    if (
      !player ||
      !heroVisible.current ||
      !audioUnlocked.current ||
      insideArtwork.current ||
      manuallyPaused.current
    )
      return;
    cancelAnimationFrame(fadeFrame.current);
    player.pause();
    player.currentTime = 0;
    player.volume = preferredVolume.current;
    try {
      await player.play();
      publishMusicState();
    } catch {
      publishMusicState();
    }
  };

  const stopWordChangeSound = () => {
    const player = audio.current;
    if (!player) return;
    cancelAnimationFrame(fadeFrame.current);
    player.pause();
    player.currentTime = 0;
    publishMusicState();
  };

  const playAmbientMusic = async () => {
    const player = ambientAudio.current;
    if (
      !player ||
      !insideArtwork.current ||
      !heroVisible.current ||
      !audioUnlocked.current ||
      manuallyPaused.current ||
      !player.paused
    )
      return;
    player.volume = preferredVolume.current;
    try {
      await player.play();
      publishMusicState();
    } catch {
      publishMusicState();
    }
  };

  const stopAmbientMusic = () => {
    const player = ambientAudio.current;
    if (!player) return;
    player.pause();
    publishMusicState();
  };

  useEffect(() => {
    const node = hero.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          stopWordChangeSound();
          stopAmbientMusic();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      wordTimer.current = window.setInterval(() => {
        setWordIndex((index) => (index + 1) % animatedWords.length);
        void playWordChangeSound();
      }, 2100);
    return () => {
      observer.disconnect();
      window.clearInterval(wordTimer.current);
    };
  }, []);

  useEffect(() => {
    const savedVolume = Number(sessionStorage.getItem('jyoti-music-volume'));
    if (savedVolume >= 0.05 && savedVolume <= 0.5)
      preferredVolume.current = savedVolume;
    manuallyPaused.current =
      sessionStorage.getItem('jyoti-music-paused') === 'true';

    const unlockAudio = () => {
      audioUnlocked.current = true;
      if (insideArtwork.current) void playAmbientMusic();
      else void playWordChangeSound();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    const toggle = () => {
      const player = audio.current;
      if (!player) return;
      const anythingPlaying =
        !player.paused ||
        Boolean(ambientAudio.current && !ambientAudio.current.paused);
      if (anythingPlaying) {
        cancelAnimationFrame(fadeFrame.current);
        player.pause();
        ambientAudio.current?.pause();
        manuallyPaused.current = true;
        sessionStorage.setItem('jyoti-music-paused', 'true');
        publishMusicState();
      } else {
        manuallyPaused.current = false;
        audioUnlocked.current = true;
        sessionStorage.setItem('jyoti-music-paused', 'false');
        if (insideArtwork.current) void playAmbientMusic();
        else void playWordChangeSound();
      }
    };
    const changeVolume = (event: Event) => {
      const value = (event as CustomEvent<{ volume: number }>).detail.volume;
      preferredVolume.current = Math.max(0.05, Math.min(0.5, value));
      sessionStorage.setItem(
        'jyoti-music-volume',
        String(preferredVolume.current),
      );
      if (audio.current && !audio.current.paused)
        audio.current.volume = preferredVolume.current;
      if (ambientAudio.current && !ambientAudio.current.paused)
        ambientAudio.current.volume = preferredVolume.current;
      publishMusicState();
    };
    window.addEventListener('toggle-music', toggle);
    window.addEventListener('set-music-volume', changeVolume);
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('pointermove', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('toggle-music', toggle);
      window.removeEventListener('set-music-volume', changeVolume);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.095;
      current.current.y += (target.current.y - current.current.y) * 0.095;
      reveal.current?.style.setProperty('--mx', `${current.current.x}%`);
      reveal.current?.style.setProperty('--my', `${current.current.y}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const moveArtwork = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = artwork.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    target.current = {
      x: (x / bounds.width) * 100,
      y: (y / bounds.height) * 100,
    };
    if (artCursor.current)
      artCursor.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    artwork.current?.classList.add('is-exploring');
  };
  return (
    <section ref={hero} id="home" className="hero reference-hero">
      <div className="hero-left">
        <div className="hero-copy">
          <button
            className="eyebrow"
            onClick={() =>
              document
                .querySelector('#experience')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Product Designer · Visual Designer
          </button>
          <h1>
            <span className="hero-heading-line">I transform</span>
            <span className="hero-heading-line">ideas into</span>
            <span className="sr-only">meaningful experiences.</span>
            <em className="animated-impact" aria-hidden="true">
              <span
                key={animatedWords[wordIndex].text}
                style={{ color: animatedWords[wordIndex].color }}
              >
                {animatedWords[wordIndex].text}
              </span>
            </em>
          </h1>
          <p>
            <strong>I’m Jyotirmoy Majhi,</strong> a multidisciplinary designer
            transforming ideas into meaningful products, visuals and memorable
            experiences.
          </p>
          <a className="primary-button resume-button" href="#contact">
            <span className="resume-label">
              Get in touch <ArrowUpRight size={17} />
            </span>
          </a>
        </div>
      </div>
      <div
        ref={artwork}
        className="hero-images"
        onPointerMove={moveArtwork}
        onPointerEnter={() => {
          insideArtwork.current = true;
          artwork.current?.classList.add('cursor-visible');
          stopWordChangeSound();
          void playAmbientMusic();
        }}
        onPointerLeave={() => {
          insideArtwork.current = false;
          artwork.current?.classList.remove('cursor-visible');
          stopAmbientMusic();
        }}
      >
        <div className="hero-image hero-mono" />
        <div ref={reveal} className="hero-image hero-color" />
        <div ref={artCursor} className="artwork-cursor" aria-hidden="true">
          <span />
        </div>
      </div>
      {/* Instrumental audio has no speech requiring captions. */}
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audio}
        src="/hero-word-change.mp3"
        preload="metadata"
        onEnded={publishMusicState}
      />
      <audio
        ref={ambientAudio}
        src="/jyoti-bengali-instrumental.mpeg"
        preload="metadata"
        onEnded={publishMusicState}
      />
      <button
        className="kolkata-mark"
        onClick={() => window.dispatchEvent(new Event('open-kolkata'))}
        aria-label="Open Kolkata story"
      >
        <span>কলকাতা</span>
        <small>
          KOLKATA
          <br />
          WEST BENGAL
          <br />
          INDIA
        </small>
      </button>
      <div className="reveal-hint">
        <span /> Move to reveal colour
      </div>
      <div className="hero-skills-marquee" aria-label="Design capabilities">
        <div className="hero-skills-track">
          {[0, 1].map((set) => (
            <div
              className="hero-skills-group"
              aria-hidden={set === 1}
              key={set}
            >
              {[
                'User Research',
                'Prototyping',
                'Typography',
                'A/B Testing',
                'Design Systems',
              ].map((skill) => (
                <span className="hero-skill" key={`${set}-${skill}`}>
                  <i /> {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ReferenceNavbar() {
  const [open, setOpen] = useState(false);
  const [music, setMusic] = useState({ playing: false, volume: 0.14 });
  useEffect(() => {
    const update = (event: Event) =>
      setMusic((event as CustomEvent<typeof music>).detail);
    window.addEventListener('music-state', update);
    return () => window.removeEventListener('music-state', update);
  }, []);
  return (
    <header className="navbar reference-navbar">
      <a href="#home" className="portrait-mark" aria-label="Home">
        <video
          src="/jyotirmoy-vector-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </a>
      <nav>
        {[
          ['Works', 'projects'],
          ['About', 'about'],
          ['Experience', 'experience'],
          ['Contact', 'contact'],
        ].map(([label, id]) => (
          <a key={label} href={`#${id}`}>
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="nav-spacer" />
      <div className={`music-control ${music.playing ? 'is-playing' : ''}`}>
        <button
          className="music-button"
          aria-label={
            music.playing ? 'Pause ambient music' : 'Play ambient music'
          }
          aria-pressed={music.playing}
          onClick={() => window.dispatchEvent(new Event('toggle-music'))}
        >
          <span className="music-note">♪</span>
          <span className="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <small>MUSIC</small>
        </button>
        <label className="volume-control">
          <span>Volume</span>
          <input
            type="range"
            min="5"
            max="50"
            value={Math.round(music.volume * 100)}
            onChange={(event) => {
              const volume = Number(event.target.value) / 100;
              setMusic((state) => ({ ...state, volume }));
              window.dispatchEvent(
                new CustomEvent('set-music-volume', { detail: { volume } }),
              );
            }}
            aria-label="Ambient music volume"
          />
        </label>
      </div>
      <a href="#contact" className="availability">
        <i /> Available for Work
      </a>
      <button
        className="menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div id="mobile-navigation" className="mobile-menu">
          {['Works', 'About', 'Experience', 'Contact'].map((x) => (
            <a
              onClick={() => setOpen(false)}
              key={x}
              href={`#${x === 'Works' ? 'projects' : x.toLowerCase()}`}
            >
              {x}
              <ArrowUpRight />
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function WhatIBring() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.38 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={section}
      className={`what-i-bring ${visible ? 'is-visible' : ''}`}
      aria-labelledby="what-i-bring-title"
    >
      <div className="bring-copy">
        <p className="bring-kicker">WHAT I BRING</p>
        <h2 id="what-i-bring-title">
          <span>Different skills</span>
          <span>One purpose</span>
          <span>making ideas work.</span>
        </h2>
        <p className="bring-description">
          I combine research, product thinking and visual craft to turn complex
          ideas into clear, useful and memorable experiences.
        </p>
      </div>
      <div className="bring-shapes" aria-hidden="true">
        <div className="design-tile tile-type">
          <span className="type-mark">Aa</span>
          <i className="tile-handle handle-one" />
          <i className="tile-handle handle-two" />
        </div>
        <div className="design-tile tile-palette">
          <Palette />
          <span className="palette-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="design-tile tile-pen">
          <PenTool />
        </div>
        <div className="design-tile tile-grid">
          <LayoutGrid />
        </div>
        <div className="design-tile tile-image">
          <ImageIcon />
        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const services = [
    [
      MousePointer2,
      'UX/UI & Product Design',
      'Designing intuitive digital products from early concepts and user flows to polished, responsive interfaces.',
    ],
    [
      Share2,
      'User Research & Strategy',
      'Understanding users through interviews, observation, journey mapping and insight-driven problem framing.',
    ],
    [
      GitBranch,
      'Prototyping & Interaction',
      'Building wireframes and interactive prototypes to communicate ideas, test flows and improve usability.',
    ],
    [
      Code2,
      'Vibe Coding & Web Builds',
      'Turning Figma concepts into responsive websites using Framer, HTML, CSS and AI-assisted development workflows.',
    ],
    [
      BookOpen,
      'Visual Communication',
      'Turning complex information into clear layouts, illustrations, presentations, posters and visual stories.',
    ],
    [
      PenTool,
      'Brand & Graphic Design',
      'Developing brand identities, typography, campaign visuals, packaging and communication assets.',
    ],
  ] as const;

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={section}
      className={`services-grid-section ${visible ? 'is-visible' : ''}`}
      aria-label="Design services"
    >
      <div className="services-grid">
        {services.map(([Icon, title, body]) => (
          <article
            className="service-card"
            key={title}
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                '--cursor-x',
                `${event.clientX - bounds.left}px`,
              );
              event.currentTarget.style.setProperty(
                '--cursor-y',
                `${event.clientY - bounds.top}px`,
              );
            }}
          >
            <span className="service-card-fill" />
            <span className="service-card-cursor">
              <MousePointer2 />
            </span>
            <div className="service-icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SelectedWorkIntro() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={section}
      id="projects"
      className={`selected-work-intro ${visible ? 'is-visible' : ''}`}
      aria-labelledby="selected-work-title"
    >
      <div className="selected-work-inner">
        <p className="selected-work-eyebrow">Selected Work</p>
        <h2 id="selected-work-title">
          <span>Projects shaped through research,</span>
          <span>systems and real human needs.</span>
        </h2>
        <p className="selected-work-description">
          A selection of product experiences designed to simplify complex
          workflows and create meaningful connections.
        </p>
      </div>
    </section>
  );
}

function VentryProject() {
  const section = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const active = useRef(false);
  const [tapped, setTapped] = useState(false);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const animateReveal = () => {
    current.current.x += (target.current.x - current.current.x) * 0.16;
    current.current.y += (target.current.y - current.current.y) * 0.16;
    artwork.current?.style.setProperty('--paint-x', `${current.current.x}%`);
    artwork.current?.style.setProperty('--paint-y', `${current.current.y}%`);
    if (active.current) frame.current = requestAnimationFrame(animateReveal);
  };

  return (
    <section
      ref={section}
      id="ventry"
      className="ventry-project is-visible"
      aria-labelledby="ventry-title"
    >
      <link rel="preload" as="image" href="/ventry-artwork-mono.jpg" />
      <link rel="preload" as="image" href="/ventry-artwork-colour.jpg" />
      <div className="ventry-editorial">
        <div
          ref={artwork}
          className={`ventry-artwork ${tapped ? 'is-tapped' : ''}`}
          onPointerEnter={(event) => {
            if (event.pointerType === 'touch') return;
            active.current = true;
            artwork.current?.classList.add('is-hovered');
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(animateReveal);
          }}
          onPointerMove={(event) => {
            if (event.pointerType === 'touch') return;
            const bounds = event.currentTarget.getBoundingClientRect();
            target.current = {
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            };
          }}
          onPointerLeave={() => {
            active.current = false;
            artwork.current?.classList.remove('is-hovered');
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
          }}
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') setTapped((value) => !value);
          }}
        >
          <div className="project-image-entrance">
            {/* Paired reveal layers need matching native image geometry. */}
            {/* oxlint-disable-next-line next/no-img-element */}
            <img
              className="ventry-layer ventry-mono"
              src="/ventry-artwork-mono.jpg"
              alt="Ventry omnichannel restaurant operations and inventory management system"
              width="1080"
              height="904"
            />
            <img
              className="ventry-layer ventry-colour"
              src="/ventry-artwork-colour.jpg"
              alt=""
              aria-hidden="true"
              width="1080"
              height="904"
            />
          </div>
        </div>
        <div className="ventry-right">
          <p className="ventry-label">01 — PRODUCT SYSTEM</p>
          <h2 id="ventry-title">VENTRY</h2>
          <p className="ventry-categories">
            <span>UX RESEARCH</span>
            <i>•</i>
            <span>OMNICHANNEL</span>
            <i>•</i>
            <span>PRODUCT DESIGN</span>
          </p>
          <h3>
            <span>Restaurant operations,</span>
            <span>connected.</span>
          </h3>
          <p className="ventry-description">
            A unified operations platform connecting inventory, vendors,
            sourcing and delivery—helping restaurant teams plan faster with
            greater visibility.
          </p>
          <p className="ventry-support">
            Developed through stakeholder research, workflow mapping and rapid
            prototyping.
          </p>
          <a
            className="ventry-button"
            href="https://www.behance.net/gallery/243632661/Ventry-An-Omnichannel-UX-Case-Study"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View Project</span>
            <i>↗</i>
          </a>
        </div>
      </div>
    </section>
  );
}

function TavvroProject() {
  const section = useRef<HTMLElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const active = useRef(false);
  const [tapped, setTapped] = useState(false);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const animateReveal = () => {
    current.current.x += (target.current.x - current.current.x) * 0.16;
    current.current.y += (target.current.y - current.current.y) * 0.16;
    artwork.current?.style.setProperty('--paint-x', `${current.current.x}%`);
    artwork.current?.style.setProperty('--paint-y', `${current.current.y}%`);
    if (active.current) frame.current = requestAnimationFrame(animateReveal);
  };

  return (
    <section
      ref={section}
      id="tavvro"
      className="ventry-project tavvro-project is-visible"
      aria-labelledby="tavvro-title"
    >
      <link rel="preload" as="image" href="/tavvro-mono.png" />
      <link rel="preload" as="image" href="/tavvro-colour.png" />
      <div className="ventry-editorial">
        <div
          ref={artwork}
          className={`ventry-artwork ${tapped ? 'is-tapped' : ''}`}
          onPointerEnter={(event) => {
            if (event.pointerType === 'touch') return;
            active.current = true;
            artwork.current?.classList.add('is-hovered');
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(animateReveal);
          }}
          onPointerMove={(event) => {
            if (event.pointerType === 'touch') return;
            const bounds = event.currentTarget.getBoundingClientRect();
            target.current = {
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            };
          }}
          onPointerLeave={() => {
            active.current = false;
            artwork.current?.classList.remove('is-hovered');
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
          }}
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') setTapped((value) => !value);
          }}
        >
          <div className="project-image-entrance">
            <figure
              className="ventry-layer ventry-mono tavvro-image"
              aria-label="TAVVRO campus laundry service with a student drop-off counter and live order tracking"
              style={{ backgroundImage: 'url(/tavvro-mono.png)' }}
            />
            <div
              className="ventry-layer ventry-colour tavvro-image"
              aria-hidden="true"
              style={{ backgroundImage: 'url(/tavvro-colour.png)' }}
            />
          </div>
        </div>
        <div className="ventry-right">
          <p className="ventry-label">02 — SERVICE EXPERIENCE</p>
          <h2 id="tavvro-title">TAVVRO</h2>
          <p className="ventry-categories">
            <span>UX RESEARCH</span>
            <i>•</i>
            <span>SERVICE DESIGN</span>
            <i>•</i>
            <span>MOBILE APP</span>
          </p>
          <h3>
            <span>Campus laundry,</span>
            <span>simplified.</span>
          </h3>
          <p className="ventry-description">
            An eco-friendly, pay-by-weight laundry service with flexible booking,
            seamless drop-offs and live tracking built around real student routines.
          </p>
          <p className="ventry-support">
            Designed through research, systems thinking and real operational needs.
          </p>
          <a
            className="ventry-button"
            href="/tavvro-colour.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View Project Preview</span>
            <i>↗</i>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <ReferenceNavbar />
      <main>
        <ReferenceHero />
        <WhatIBring />
        <ServicesGrid />
        <SelectedWorkIntro />
        <ProjectMotion>
          <VentryProject />
          <TavvroProject />
        </ProjectMotion>
        <About />
        <Experience />
      </main>
      <Footer />
      <Overlays />
    </>
  );
}
