'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GlobalOverlays() {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const updateTime = () => {
      const now = new Date();
      setTime(`2007/11/14 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(int);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Dark Glassmorphism Overlay */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[-1]" />

      {/* Radial Spotlight */}
      <div className="fixed inset-0 radial-spotlight pointer-events-none z-[-1]" />

      {/* Moving Scanline */}
      <div className="vhs-scanline" />

      {/* HUD Elements Removed per user request */}

      <div className="fixed top-8 right-8 z-[1000] text-right pointer-events-none select-none">
        <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">
          Battery: 82% [|||--]
        </div>
        <div className="text-white/20 text-[8px] font-mono uppercase tracking-[0.3em]">
          Source: RE_DRIVE_01
        </div>
      </div>

      <div className="fixed bottom-8 left-8 z-[1000] pointer-events-none select-none">
        <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
          <span className="text-white/60">SP</span> 0:42:12
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[1000] text-right pointer-events-none select-none">
        <div className="text-white/80 text-xl md:text-3xl font-mono tracking-[0.1em] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] flex flex-col">
          <span>{time.split(' ')[1]}</span>
          <span className="text-[10px] text-white/40 tracking-[0.2em] -mt-1 font-bold">{time.split(' ')[0]}</span>
        </div>
      </div>

      {/* Occasional Interference Bar */}
      <motion.div 
        animate={{ 
          top: ["-10%", "110%"],
          opacity: [0, 0.1, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          repeatDelay: 10,
          ease: "linear" 
        }}
        className="fixed left-0 right-0 h-10 bg-white/10 blur-xl pointer-events-none z-[1000]"
      />
    </>
  );
}

