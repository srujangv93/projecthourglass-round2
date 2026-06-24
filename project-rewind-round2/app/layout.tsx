import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Rewind - Round 2',
  description: 'Visual Steganography Reconstruction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-mono">
        <div className="crt-scanlines"></div>
        {children}
      </body>
    </html>
  );
}
