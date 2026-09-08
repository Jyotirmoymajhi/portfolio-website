import type { Metadata } from 'next';
import { TavvroStudy } from './tavvro-study';
import './tavvro.css';

export const metadata: Metadata = {
  title: 'Tavvro — Campus laundry, simplified. | Jyotirmoy Majhi',
  description: 'A student-focused laundry service case study connecting UX research, service design and responsible campus living.',
  alternates: { canonical: '/works/tavvro' },
  openGraph: { title: 'Tavvro — Campus laundry, simplified.', description: 'UX research and service design for a more dependable campus laundry experience.', url: '/works/tavvro', images: [{ url: '/tavvro-colour.png', width: 1440, height: 904 }] },
};

export default function TavvroPage() { return <TavvroStudy />; }
