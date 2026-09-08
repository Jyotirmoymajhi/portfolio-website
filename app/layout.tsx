import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AnimatedFavicon } from '@/components/animated-favicon';
import { SiteCursor } from '@/components/site-cursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jyotirmoy.work'),
  title: 'Jyotirmoy Majhi — Product Designer & Visual Thinker',
  description:
    'Portfolio of Jyotirmoy Majhi, a product designer and visual thinker from Kolkata shaping meaningful digital experiences.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jyotirmoy Majhi — Product Designer & Visual Thinker',
    description:
      'Portfolio of Jyotirmoy Majhi, a product designer and visual thinker from Kolkata shaping meaningful digital experiences.',
    url: 'https://jyotirmoy.work',
    siteName: 'Jyotirmoy Majhi',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <head>
        <link rel="icon" type="image/png" href="/favicons/favicon.png" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
        <AnimatedFavicon />
        <SiteCursor />
      </body>
    </html>
  );
}
