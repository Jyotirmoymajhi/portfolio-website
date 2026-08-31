'use client';
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  MoveRight,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
const projects = [
  [
    '01',
    'VENTRY',
    'Fintech · Product design',
    '2026',
    'ventry',
    'Making complex investment decisions feel calm, legible and human.',
  ],
  [
    '02',
    'DreamHome OS',
    'Proptech · Service design',
    '2025',
    'dream',
    'One thoughtful operating system for the emotional work of finding a home.',
  ],
  [
    '03',
    'Sowaka',
    'Wellbeing · Brand system',
    '2025',
    'sowaka',
    'A gentle everyday ritual shaped through identity, product and motion.',
  ],
  [
    '04',
    'Airport Anxiety Navigator',
    'Travel · UX research',
    '2024',
    'airport',
    'Reducing uncertainty at every step of an unfamiliar journey.',
  ],
  [
    '05',
    'Inclusive Sikh Learning',
    'Education · Accessibility',
    '2024',
    'sikh',
    'A learning experience designed across language, ability and generation.',
  ],
];
function Hero() {
  const hero = useRef<HTMLElement>(null),
    reveal = useRef<HTMLDivElement>(null),
    image = useRef<HTMLDivElement>(null),
    copy = useRef<HTMLDivElement>(null),
    target = useRef({ x: 72, y: 44 }),
    current = useRef({ x: 72, y: 44 });
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      const { x, y } = current.current;
      reveal.current?.style.setProperty('--mx', `${x}%`);
      reveal.current?.style.setProperty('--my', `${y}%`);
      if (image.current)
        image.current.style.transform = `translate3d(${(x - 50) * -0.16}px,${(y - 50) * -0.1}px,0) scale(1.025)`;
      if (copy.current)
        copy.current.style.transform = `translate3d(${(x - 50) * 0.025}px,${(y - 50) * 0.02}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const move = (e: React.PointerEvent) => {
    const r = hero.current?.getBoundingClientRect();
    if (r)
      target.current = {
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
  };
  return (
    <section id="home" ref={hero} onPointerMove={move} className="hero">
      <div ref={image} className="hero-images" aria-hidden="true">
        <div className="hero-image hero-mono" />
        <div ref={reveal} className="hero-image hero-color" />
      </div>
      <div className="hero-shade" />
      <div ref={copy} className="hero-copy">
        <button
          className="eyebrow"
          onClick={() =>
            document
              .querySelector('#experience')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Product designer · Visual thinker <ArrowUpRight size={14} />
        </button>
        <h1>
          Designing experiences
          <br />
          that <em>connect</em> people.
        </h1>
        <p>
          I’m Jyotirmoy Majhi — turning human problems into meaningful products,
          visual systems and memorable digital experiences.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            Explore selected work <ArrowDownRight size={18} />
          </a>
          <button
            className="text-button"
            onClick={() => window.dispatchEvent(new Event('open-about'))}
          >
            A little about me <MoveRight size={18} />
          </button>
        </div>
      </div>
      <button
        className="kolkata-mark"
        onClick={() => window.dispatchEvent(new Event('open-kolkata'))}
      >
        <span>কলকাতা</span>
        <small>KOLKATA · 22.5726° N</small>
      </button>
      <div className="reveal-hint">
        <span /> Move to reveal colour
      </div>
      <a className="scroll-note" href="#projects">
        Scroll to explore <ArrowDownRight size={15} />
      </a>
    </section>
  );
}
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <a href="#home" className="monogram">
        JM<span>®</span>
      </a>
      <nav>
        {['Projects', 'About', 'Experience', 'Playground'].map((x) => (
          <a key={x} href={`#${x.toLowerCase()}`}>
            <span>{x}</span>
          </a>
        ))}
      </nav>
      <div className="nav-end">
        <a href="#contact" className="availability">
          <i /> Available for work
        </a>
        <button className="menu" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {['Projects', 'About', 'Experience', 'Playground', 'Contact'].map(
            (x) => (
              <a
                onClick={() => setOpen(false)}
                key={x}
                href={`#${x.toLowerCase()}`}
              >
                {x}
                <ArrowUpRight />
              </a>
            ),
          )}
        </div>
      )}
    </header>
  );
}
function Projects() {
  return (
    <section id="projects" className="projects section-pad">
      <div className="section-kicker">
        <span>01</span>
        <p>Selected work</p>
        <small>2024—2026</small>
      </div>
      <div className="project-intro">
        <h2>
          Ideas made
          <br />
          <em>tangible.</em>
        </h2>
        <p>
          Selected work across product strategy, research, interaction and
          visual systems — each shaped around a real human tension.
        </p>
      </div>
      <div className="project-list">
        {projects.map((p) => (
          <article className="project" key={p[1]} tabIndex={0}>
            <div className={`project-art ${p[4]}`}>
              <span className="project-number">{p[0]}</span>
              <div className="art-orbit">
                <span>{p[1].slice(0, 2)}</span>
              </div>
              <ArrowUpRight className="project-arrow" />
            </div>
            <div className="project-meta">
              <div>
                <small>{p[2]}</small>
                <h3>{p[1]}</h3>
              </div>
              <p>{p[5]}</p>
              <span>{p[3]}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
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
      <a href="mailto:hello@jyotirmoy.design">
        hello@jyotirmoy.design <ArrowUpRight />
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
  if (!o) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <button className="overlay-close" onClick={() => setO(null)}>
        Close ×
      </button>
      <div className="overlay-inner">
        {o === 'about' ? (
          <>
            <BriefcaseBusiness />
            <small>ABOUT JYOTIRMOY</small>
            <h2>A designer who believes clarity can still have soul.</h2>
            <p>
              I move between product strategy, visual design and research —
              looking for the human thread that helps the whole experience make
              sense.
            </p>
          </>
        ) : (
          <>
            <MapPin />
            <small>CITY OF JOY</small>
            <h2>Kolkata taught me to design in layers.</h2>
            <p>
              Heritage beside momentum. Precise craft beside beautiful
              improvisation. The city is part of how I observe, connect and
              create.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
function ReferenceHero() {
  const animatedWords = [
    { text: 'impact.', color: '#f04a13' },
    { text: 'meaning.', color: '#2f8f62' },
    { text: 'experiences.', color: '#3977bd' },
    { text: 'possibilities.', color: '#7a59a8' },
    { text: 'reality.', color: '#d14f3f' },
  ];
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
    wordTimer.current = window.setInterval(() => {
      setWordIndex((index) => (index + 1) % animatedWords.length);
      playWordChangeSound();
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
    manuallyPaused.current = false;
    sessionStorage.setItem('jyoti-music-paused', 'false');

    const unlockAudio = () => {
      audioUnlocked.current = true;
      if (insideArtwork.current) playAmbientMusic();
      else playWordChangeSound();
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
        if (insideArtwork.current) playAmbientMusic();
        else playWordChangeSound();
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
      cancelAnimationFrame(fadeFrame.current);
      window.removeEventListener('toggle-music', toggle);
      window.removeEventListener('set-music-volume', changeVolume);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
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
            <em className="animated-impact" aria-live="polite">
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
              Download Resume <ArrowUpRight size={17} />
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
          playAmbientMusic();
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
      <button className="menu" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div className="mobile-menu">
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
        <div className="bring-shape bring-shape-pointer">
          <span className="dotted-cursor" />
          <span className="cursor-stem stem-one" />
          <span className="cursor-stem stem-two" />
          <span className="bezier-curve" />
          <span className="shape-node node-a" />
          <span className="shape-node node-b" />
          <span className="shape-node node-c" />
        </div>
        <div className="bring-shape bring-shape-grid">
          <span className="dotted-cursor" />
          <span className="cursor-center-node" />
          <span className="shape-grid-icon">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="shape-node node-a" />
          <span className="shape-node node-b" />
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
        <Projects />
        <About />
        <Experience />
        <section id="playground" className="playground section-pad">
          <div>
            <small>PLAYGROUND / 04</small>
            <h2>
              Experiments,
              <br />
              visual notes &<br />
              <em>happy accidents.</em>
            </h2>
          </div>
          <div className="play-cards">
            <span>Type & rhythm</span>
            <span>Motion studies</span>
            <span>Unfinished ideas</span>
          </div>
        </section>
      </main>
      <Footer />
      <Overlays />
    </>
  );
}
