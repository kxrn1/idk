import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Subway — Design Engineer & Fullstack Developer',
  description: 'Building digital experiences that matter. Design Engineer & Fullstack Developer crafting clean, scalable solutions.',
  keywords: ['subway', 'developer', 'fullstack', 'design engineer', 'react', 'typescript', 'portfolio'],
  authors: [{ name: 'Subway', url: 'https://subway.dev' }],
  creator: 'Subway',
  openGraph: {
    title: 'Subway — Design Engineer & Fullstack Developer',
    description: 'Building digital experiences that matter.',
    type: 'profile',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subway — Design Engineer & Fullstack Developer',
    description: 'Building digital experiences that matter.',
    creator: '@subway_dev',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
