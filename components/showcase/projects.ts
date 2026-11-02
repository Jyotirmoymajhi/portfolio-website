// Copy and destinations verified against jyotirmoy.work, October 2026.
// Artwork is an optimized copy of the original portfolio assets.
export type Project = {
  id: string; name: string; category: string; disciplines: string;
  headline: [string, string]; description: string; additional: string;
  href: string; image: string; alt: string;
};
export const projects: Project[] = [
  {
    id: 'ventry', name: 'VENTRY', category: 'PRODUCT SYSTEM',
    disciplines: 'UX RESEARCH · OMNICHANNEL · PRODUCT DESIGN',
    headline: ['Restaurant operations,', 'connected.'],
    description: 'A unified operations platform connecting inventory, vendors, sourcing and delivery—helping restaurant teams plan faster with greater visibility.',
    additional: 'Developed through stakeholder research, workflow mapping and rapid prototyping.',
    href: 'https://www.behance.net/gallery/243632661/Ventry-An-Omnichannel-UX-Case-Study',
    image: '/images/showcase/ventry.webp', alt: 'VENTRY restaurant kitchen, inventory dashboard, wholesale ingredients and delivery service',
  },
  {
    id: 'tavvro', name: 'TAVVRO', category: 'SERVICE EXPERIENCE',
    disciplines: 'UX RESEARCH · SERVICE DESIGN · MOBILE APP',
    headline: ['Campus laundry,', 'simplified.'],
    description: 'An eco-friendly, pay-by-weight laundry service with flexible booking, seamless drop-offs and live tracking built around real student routines.',
    additional: 'Designed through research, systems thinking and real operational needs.',
    href: '/works/tavvro', image: '/images/showcase/tavvro-campus-laundry.png',
    alt: 'TAVVRO campus laundry with a smartphone app, laundry bag, student, laundry staff and delivery van',
  },
  {
    id: 'sitstick', name: 'SITSTICK', category: 'MOBILITY INNOVATION',
    disciplines: 'USER RESEARCH · PRODUCT DESIGN · PROTOTYPING',
    headline: ['Mobility with a', 'moment of rest.'],
    description: 'A walking-support solution that transforms into a portable seat, helping older adults move confidently and rest whenever needed.',
    additional: 'Designed through user research, ergonomic exploration and real mobility needs.',
    href: 'https://www.behance.net/gallery/248914979/SitStick-Redefining-Elderly-Mobility-Product-Design',
    image: '/images/showcase/sitstick.webp', alt: 'SITSTICK walking support and portable seat, with an older adult resting in a park',
  },
];
