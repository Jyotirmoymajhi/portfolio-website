'use client';
/* oxlint-disable next/no-img-element -- Original artwork retains its native proportions. */
/* oxlint-disable next/no-html-link-for-pages -- Full document navigation preserves the homepage's existing anchor and animation initialization. */
import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { RevealImage } from '@/components/reveal-image';

const behance = 'https://www.behance.net/gallery/249204643/Tavvro-Eco-Friendly-Laundry-Service-App-for-Students';
const metadata = [
  ['Role', 'UX/UI Designer & Researcher'], ['Duration', '5 Weeks'],
  ['Platform', 'Mobile Application'], ['Industry', 'Sustainability & Service Design'],
  ['Team', 'Jyotirmoy Majhi & Vanshika Dahiya'], ['Audience', 'University Students & Hostel Residents'],
];
const insights = [
  'Students need laundry services to adapt to changing schedules.',
  'Visibility matters because uncertainty begins after clothes leave the student’s hands.',
  'Clear weight and pricing information builds confidence before confirmation.',
  'Reliable handovers are essential for preventing confusion and misplaced orders.',
  'Sustainability becomes meaningful when it is visible in the service, not only mentioned in branding.',
];
const journey = ['Choose service', 'Schedule pickup', 'Add preferences', 'Review weight and price', 'Confirm order', 'Track cleaning status', 'Receive ready notification', 'Complete verified collection'];
const features = [
  ['Flexible Scheduling', 'Students can select a suitable pickup slot instead of depending on one fixed hostel schedule.'],
  ['Clear Order Setup', 'Service type, fabric preferences and special instructions are captured before confirmation.'],
  ['Weight-Based Pricing', 'Students can understand the service cost through transparent weight and pricing information.'],
  ['Live Status Tracking', 'Clear stages show whether an order has been received, is being washed or is ready for collection.'],
  ['Verified Collection', 'A clear digital order confirmation supports a more dependable pickup and return process.'],
  ['Sustainable Choices', 'Responsible service information helps students understand how more efficient laundry decisions reduce unnecessary resource use.'],
];
function Section({ number, label, title, children }: { number: string; label: string; title?: string; children: ReactNode }) {
  return <section className="tc-section" aria-labelledby={`section-${number}`}>
    <p className="tc-eyebrow" data-enter>{number} / {label}</p>
    <div className="tc-section-body">
      <h2 id={`section-${number}`} data-enter>{title || label}</h2>
      <div className="tc-content" data-enter>{children}</div>
    </div>
  </section>;
}
function Statements({ items }: { items: string[][] }) {
  return <div className="tc-statements">{items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>;
}
function FullStudyLink() {
  return <a className="tc-button portfolio-button" href={behance} target="_blank" rel="noopener noreferrer">View Full Case Study <ArrowUpRight size={19} aria-hidden="true" /></a>;
}
function Artwork({ final = false }: { final?: boolean }) {
  return <figure className={final ? 'tc-showcase' : 'tc-hero-art'}>
    <RevealImage className="tc-artwork" instructionId={final ? 'tavvro-final' : 'tavvro-case-study'}>
      <img src="/tavvro-mono.png" width={1440} height={904} loading={final ? 'lazy' : 'eager'} alt="Tavvro campus laundry concept: a student at the collection counter, labelled laundry bags and an order-status display." />
      <img className="ventry-colour" src="/tavvro-colour.png" width={1440} height={904} loading={final ? 'lazy' : 'eager'} alt="" aria-hidden="true" />
    </RevealImage>
    {final && <figcaption>Service concept artwork · Booking, cleaning and collection as one connected experience.</figcaption>}
  </figure>;
}
export function TavvroStudy() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const node = root.current;
    if (node) node.dataset.ready = 'true';
    if (!node || media.matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('tc-visible'); observer.unobserve(entry.target); } });
    }, { threshold: .2 });
    // Observe bounded content groups so long sections always reach the threshold.
    node.querySelectorAll<HTMLElement>('[data-enter]').forEach((item, index) => {
      item.style.setProperty('--enter-delay', `${(index % 3) * 100}ms`);
      if (item.getBoundingClientRect().top > window.innerHeight) { item.classList.add('tc-pending'); observer.observe(item); }
    });
    const reduce = () => { if (media.matches) { observer.disconnect(); node.querySelectorAll('.tc-pending').forEach(item => item.classList.remove('tc-pending')); } };
    media.addEventListener('change', reduce);
    return () => { observer.disconnect(); media.removeEventListener('change', reduce); };
  }, []);
  return <div ref={root} className="tavvro-case">
    <a className="tc-skip" href="#case-study">Skip to case study</a>
    <header className="tc-header"><a href="/#projects">← Back to Works</a><a href="/" className="tc-author">JYOTIRMOY MAJHI <span> / PORTFOLIO</span></a></header>
    <main id="case-study" className="tc-main">
      <section className="tc-hero" aria-labelledby="tavvro-title">
        <div className="tc-hero-copy"><p className="tc-eyebrow">02 — SERVICE EXPERIENCE</p><h1 id="tavvro-title">TAVVRO</h1><p className="tc-statement">Campus laundry,<br />simplified.</p><p className="tc-intro">Tavvro is a student-focused, eco-conscious laundry service designed to make campus laundry more flexible, transparent and dependable.</p><FullStudyLink /></div>
        <Artwork />
      </section>
      <dl className="tc-metadata">{metadata.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <Section number="01" label="Project Overview" title="Making campus laundry work around student life."><p>Tavvro reimagines the fragmented hostel laundry experience as one connected service. Students can schedule pickups, understand pricing, follow every stage of an order and receive their clothes through a clear, accountable handover process.</p><ul className="tc-goals">{['Flexible booking', 'Transparent tracking', 'Responsible cleaning'].map(goal => <li key={goal}>{goal}</li>)}</ul></Section>
      <Section number="02" label="What, Why and How"><Statements items={[
        ['What', 'A mobile-first laundry service connecting booking, pickup, cleaning, order tracking and delivery in one experience.'],
        ['Why', 'Traditional hostel laundry systems often depend on rigid schedules, verbal updates and unclear handovers, leaving students uncertain about their clothes and delivery time.'],
        ['How', 'By combining flexible scheduling, weight-based pricing, status updates and verified collection into a simple end-to-end service journey.'],
      ]} /></Section>
      <Section number="03" label="Context" title="Laundry is a small task with repeated friction."><p>For students living in hostels, laundry is a recurring responsibility managed alongside classes, assignments and campus activities. Existing services often provide limited flexibility, inconsistent communication and little visibility after clothes are submitted.</p><h3 className="tc-small-heading">Current experience</h3><ul className="tc-list">{['Fixed or inconvenient collection schedules', 'Unclear pricing and delivery timelines', 'Limited communication during cleaning', 'Risk of mixed-up or misplaced clothes', 'Uncertain pickup and return handovers', 'Concerns about hygiene and responsible washing'].map(item => <li key={item}>{item}</li>)}</ul></Section>
      <Section number="04" label="Research and Discovery" title="Understanding routines before designing screens."><p>We studied how university students currently manage laundry, where the service breaks down and what creates uncertainty. The research focused on real hostel routines, expectations around hygiene, communication habits and trust during handovers.</p><ul className="tc-methods">{['20+ student conversations', 'Contextual observation', 'Journey mapping', 'Competitor review', 'Pain-point clustering', 'Service-touchpoint analysis'].map(method => <li key={method}>{method}</li>)}</ul></Section>
      <Section number="05" label="Key Insights"><ol className="tc-insights">{insights.map((insight, i) => <li key={insight}><span aria-hidden="true">0{i + 1}</span><p>{insight}</p></li>)}</ol></Section>
      <Section number="06" label="Problem Definition" title="The service was convenient in theory, but uncertain in practice."><p>University students need a flexible and transparent way to manage laundry because rigid schedules, unclear updates and unreliable handovers create unnecessary stress and reduce trust in the service.</p><blockquote><span className="tc-eyebrow">THE DESIGN QUESTION</span>How might we create a campus laundry experience that feels flexible, visible and dependable from booking to collection?</blockquote></Section>
      <Section number="07" label="User Journey"><ol className="tc-journey">{journey.map((step, i) => <li key={step}><span aria-hidden="true">0{i + 1}</span><p>{step}</p></li>)}</ol></Section>
      <Section number="08" label="Service System" title="One connected experience across physical and digital touchpoints."><div className="tc-blueprint">{[
        ['Student experience', 'Booking, preferences, payment, notifications and order tracking.'],
        ['Service operations', 'Pickup management, order identification, weighing, cleaning status and delivery preparation.'],
        ['Physical touchpoints', 'Laundry bags, collection counter, order labels and verified handover.'],
      ].map(([title, body], i) => <div className="tc-layer" key={title}><h3>{title}</h3><p>{body}</p>{i < 2 && <ArrowDown className="tc-connector" aria-label="Connected to" size={22} />}</div>)}</div></Section>
      <Section number="09" label="Design Principles"><Statements items={[
        ['Flexibility', 'Let students choose times that work around their academic routines.'], ['Visibility', 'Keep every stage of the laundry journey understandable.'],
        ['Trust', 'Make pricing, order identity and handovers clear.'], ['Responsibility', 'Support efficient washing and more conscious service choices.'],
      ]} /></Section>
      <Section number="10" label="Solution" title="From booking to collection, every step stays visible."><div className="tc-features">{features.map(([title, body], i) => <article key={title}><div><p className="tc-eyebrow">Feature 0{i + 1}</p><h3>{title}</h3></div><p>{body}</p></article>)}</div><p className="tc-media-note">Explore the original mobile screens in the full case study.</p><FullStudyLink /></Section>
      <Section number="11" label="Visual System"><p>The visual system combines a clean mobile interface with approachable green accents, clear status communication and an identity built around responsible campus living.</p><Statements items={[
        ['Identity & illustration', 'The supplied service artwork shows the Tavvro identity on the counter and laundry bags, grounded in everyday campus life.'],
        ['Interface system', 'Visit the original case study for the mobile interface and its visual details.'],
      ]} /><a className="tc-text-link" href={behance} target="_blank" rel="noopener noreferrer">Explore the visual system on Behance ↗</a></Section>
      <Section number="12" label="Final Experience" title="A calmer and more accountable laundry routine."><p>The final experience connects scheduling, service preferences, transparent pricing, progress updates and collection into one continuous journey. Tavvro turns laundry from an uncertain hostel task into a service students can understand and manage.</p><Artwork final /></Section>
      <Section number="13" label="Outcome"><p className="tc-media-note">Qualitative design outcomes · No commercial metrics reported.</p><ul className="tc-outcomes">{['Reduced uncertainty throughout the order journey', 'Improved visibility of laundry status', 'Clearer pricing and service expectations', 'More dependable order identification', 'A stronger connection between sustainability and daily behaviour'].map(item => <li key={item}>{item}</li>)}</ul></Section>
      <Section number="14" label="Reflection" title="What I learned."><Statements items={[
        ['Service design', 'A strong app experience depends on the operational system supporting it.'], ['Trust', 'Small moments of clarity can remove significant uncertainty.'],
        ['Research', 'Everyday student routines revealed opportunities that a screen-first approach would have missed.'], ['Systems thinking', 'Digital and physical touchpoints must work together as one continuous experience.'],
      ]} /></Section>
    </main>
    <footer className="tc-footer"><p className="tc-eyebrow">15 / KEEP EXPLORING</p><nav aria-label="Project navigation"><a href="/#ventry"><span>Previous Project</span><strong>← VENTRY</strong></a><a href="/#sitstick"><span>Next Project</span><strong>SITSTICK ↗</strong></a></nav><a className="tc-text-link" href="/#projects">Back to Selected Work</a></footer>
  </div>;
}
