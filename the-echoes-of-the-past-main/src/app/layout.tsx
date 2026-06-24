import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/ParticleBackground";
import GlobalOverlays from "@/components/GlobalOverlays";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Echoes of the Past - Archive",
  description: "Calibrate the simulation's sensory data by identifying forgotten sounds from the past.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased crt-overlay noise crt-startup font-mono overflow-x-hidden`}>
        <GlobalOverlays />
        <ParticleBackground />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
