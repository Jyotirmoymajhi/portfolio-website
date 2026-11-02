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
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HeroImage } from '@/components/hero-image';
import { PortfolioAudio } from '@/components/reveal-image';
import { ProjectShowcase } from '@/components/showcase/ProjectShowcase';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
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
const HERO_WORD_DURATION_MS = 4200;
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
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setWordIndex(index => (index + 1) % animatedWords.length), HERO_WORD_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [wordIndex]);
  useEffect(() => {
    const restart = () => setWordIndex(index => (index + 1) % animatedWords.length);
    window.addEventListener('hero-text-restart', restart);
    return () => window.removeEventListener('hero-text-restart', restart);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new Event('hero-word-change'));
  }, [wordIndex]);
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
                style={{ color: animatedWords[wordIndex].color, animationDuration: `${HERO_WORD_DURATION_MS}ms` }}
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
          <a className="primary-button resume-button portfolio-button" href="#contact">
            <span className="resume-label">
              Download Resume <ArrowUpRight size={17} />
            </span>
          </a>
        </div>
      </div>
      <HeroImage />
      <PortfolioAudio />
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
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users must be able to scroll this region in reduced-motion mode. */}
      <section className="hero-skills-marquee" aria-label="Design capabilities" tabIndex={0}>
        <div className="hero-skills-track">
          {[0, 1].map((set) => (
            <ul
              className="hero-skills-group"
              aria-hidden={set === 1}
              key={set}
            >
              {[
                'UX/UI Design',
                'Brand Identity',
                'User Research',
                'Typography',
                'Product Design',
                'Illustration',
                'Interaction Design',
                'Visual Communication',
                'Information Architecture',
                'Graphic Design',
                'Prototyping',
                'Design Systems',
                'Journey Mapping',
                'Visual Design',
                'Usability Testing',
                'Vibe Coding',
                'Wireframing',
                'Responsive Web Prototyping',
                'User Flows',
              ].map((skill) => (
                <li className="hero-skill" key={`${set}-${skill}`}>
                  <i aria-hidden="true" /> {skill}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    </section>
  );
}
function ReferenceNavbar() {
  const [open, setOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const musicCell = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!volumeOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !musicCell.current?.contains(event.target)) setVolumeOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setVolumeOpen(false); musicCell.current?.querySelector('button')?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [volumeOpen]);
  const [music, setMusic] = useState({ playing: false, volume: 1 });
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
      <div ref={musicCell} data-volume-open={volumeOpen} className={`music-control ${music.playing ? 'is-playing' : ''}`}>
        <button
          className="music-button"
          aria-label={
            music.playing ? 'Pause ambient music' : 'Play ambient music'
          }
          aria-pressed={music.playing}
          aria-expanded={volumeOpen}
          aria-controls="music-volume"
          onClick={() => {
            setVolumeOpen(value => !value);
            window.dispatchEvent(new Event('toggle-music'));
          }}
        >
          <span className="music-note">♪</span>
          <span className="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <small>MUSIC</small>
        </button>
        <label id="music-volume" className="music-volume-inline" hidden={!volumeOpen}>
          <input type="range" min="0" max="100" step="1"
            aria-label="Music volume"
            aria-valuetext={Math.round(music.volume * 100) + '%'}
            value={Math.round(music.volume * 100)}
            onChange={(event) => {
              const volume = Number(event.target.value) / 100;
              setMusic(state => ({ ...state, volume }));
              window.dispatchEvent(new CustomEvent('set-music-volume', { detail: { volume } }));
            }}
          />
          <output aria-hidden="true">{Math.round(music.volume * 100)}%</output>
        </label>
      </div>
      <a href="#contact" className="availability">
        <span className="availability-dot" aria-hidden="true">
          <span className="availability-dot__core" />
          <span className="availability-dot__pulse" />
        </span>
        Available for Work
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

export default function Home() {
  return (
    <>
      <ReferenceNavbar />
      <main>
        <ReferenceHero />
        <WhatIBring />
        <ServicesGrid />
        <SelectedWorkIntro />
        <ProjectShowcase />
      </main>
      <Overlays />
    </>
  );
}
