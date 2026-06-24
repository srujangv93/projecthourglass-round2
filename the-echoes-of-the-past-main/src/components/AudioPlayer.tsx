'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      html5: true,
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => {
        setPlaying(false);
        setProgress(0);
      },
      onend: () => {
        setPlaying(false);
        setProgress(0);
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek();
          const duration = soundRef.current.duration();
          setProgress((seek / duration) * 100);
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [playing]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const restart = () => {
    if (!soundRef.current) return;
    soundRef.current.stop();
    soundRef.current.play();
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    soundRef.current.mute(newMuted);
  };

  const [visualizerDurations, setVisualizerDurations] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisualizerDurations(Array.from({ length: 16 }, () => 0.4 + Math.random() * 0.8));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full win-bevel bg-[#2C2C2C] p-6 shadow-2xl relative overflow-hidden group">
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* Visualizer Placeholder / Display Area */}
        <div className="h-24 bg-[#0A0A0A] border-4 border-[#3E2723] rounded-lg flex items-center justify-center relative overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%] pointer-events-none z-10" />
          
          {/* Fake Visualizer bars */}
          <div className="absolute inset-0 flex items-end justify-center gap-1.5 p-3 opacity-40">
            {visualizerDurations.map((duration, i) => (
              <motion.div 
                key={i}
                animate={{ height: playing ? [15, 60, 30, 70, 20] : 8 }}
                transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
                className="w-2.5 bg-gradient-to-t from-[#3A6EA5] to-[#8CFF8C] rounded-t-sm shadow-[0_0_5px_rgba(140,255,140,0.5)]"
              />
            ))}
          </div>
          <div className="relative z-20 text-[10px] font-mono text-[#00FF00] tracking-[0.4em] uppercase text-center font-bold drop-shadow-[0_0_5px_#00FF00]">
            {playing ? "● SIGNAL_ACTIVE" : "■ IDLE_STBY"}
          </div>
        </div>

        {/* Progress Bar - Classic Hardware Style */}
        <div className="space-y-2">
          <div className="h-5 bg-[#1A1A1A] border-2 border-[#5D4037] rounded-md relative overflow-hidden p-1 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#3A6EA5] via-[#5C7C99] to-[#3A6EA5] shadow-[0_0_15px_rgba(58,110,165,0.8)] rounded-sm relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[scanline_3s_linear_infinite]" />
            </motion.div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[#8D6E63] font-bold uppercase tracking-widest">
            <span>00:00:00</span>
            <span className="text-[#3A6EA5]">RE_CALIB: {Math.floor(progress).toString().padStart(3, '0')}%</span>
          </div>
        </div>

        {/* Controls - Physical Hardware Buttons */}
        <div className="flex items-center justify-between border-t border-[#3E2723] pt-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="glossy-button w-14 h-14 rounded-full bg-[#3A6EA5] text-[#F5E6D3] hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center border-2 border-[#F5E6D3]/20"
            >
              {playing ? <Pause size={24} fill="#F5E6D3" /> : <Play size={24} fill="#F5E6D3" className="ml-1" />}
            </button>
            <button 
              onClick={restart}
              className="glossy-button w-11 h-11 rounded-full bg-[#5D4037] text-[#F5E6D3] hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center border-2 border-[#F5E6D3]/10"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end gap-1">
              <div className="text-[8px] font-mono text-[#8D6E63] tracking-[0.2em] font-black uppercase">Sampling_Rate: 44.1kHz</div>
              <div className="text-[8px] font-mono text-[#8D6E63] tracking-[0.2em] font-black uppercase">Bitrate: 128kbps_CBR</div>
            </div>
            <button 
              onClick={toggleMute}
              className={`p-3 rounded-lg border-2 transition-all ${muted ? 'bg-[#C62828] border-[#C62828] text-white' : 'bg-[#1A1A1A] border-[#5D4037] text-[#8D6E63] hover:text-white'}`}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
