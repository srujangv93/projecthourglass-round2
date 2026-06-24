"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Paths to our generated images
const CORRUPTED_IMAGE = '/corrupted_starry_sky.png';
const RESTORED_IMAGE = '/happy_planetarium.png';

// The 5 lenses configurations
const LENSES = [
  { id: 'cyan', color: 'rgba(0, 255, 255, 0.5)', label: 'OPTIC-C', defaultX: -220, defaultY: -100 },
  { id: 'magenta', color: 'rgba(255, 0, 255, 0.5)', label: 'OPTIC-M', defaultX: -220, defaultY: 50 },
  { id: 'yellow', color: 'rgba(255, 255, 0, 0.5)', label: 'OPTIC-Y', defaultX: 220, defaultY: -100 },
  { id: 'crimson', color: 'rgba(255, 0, 0, 0.5)', label: 'DECOY-R', defaultX: 220, defaultY: 50 },
  { id: 'emerald', color: 'rgba(0, 255, 0, 0.5)', label: 'DECOY-G', defaultX: -220, defaultY: 200 },
];

export default function RoundTwo() {
  const [inputValue, setInputValue] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'glitch' | 'crash'>('playing');
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const containerRef = useRef(null);

  const crashMessages = [
    "> WARNING: ANOMALY DETECTED.",
    "> SYSTEM LOST TRACK OF SUBJECT.",
    "> ATTEMPTS TO COMMUNICATE FAILED.",
    "> CONSCIOUSNESS UNRESPONSIVE."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    if (inputValue.trim().toUpperCase() === 'SUPERNOVA') {
      triggerClimaxSequence();
    } else {
      setErrorMsg('INVALID CIPHER. SYNC DISTORTED.');
      setShake(true);
    }
  };

  const triggerClimaxSequence = () => {
    // T=0s: Victory
    setGameState('victory');
    setErrorMsg('');

    // T=4s: Glitch
    setTimeout(() => {
      setGameState('glitch');
    }, 4000);

    // T=5s: Crash
    setTimeout(() => {
      setGameState('crash');
    }, 5000);
  };

  // Typewriter effect for crash state
  useEffect(() => {
    if (gameState === 'crash') {
      let currentText = '';
      let msgIndex = 0;
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (msgIndex < crashMessages.length) {
          if (charIndex < crashMessages[msgIndex].length) {
            currentText += crashMessages[msgIndex][charIndex];
            setTypewriterText(currentText);
            charIndex++;
          } else {
            currentText += '\n';
            msgIndex++;
            charIndex = 0;
          }
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
      return () => clearInterval(typeInterval);
    }
  }, [gameState]);

  if (gameState === 'crash') {
    return (
      <div className="w-full h-screen bg-black flex flex-col justify-center p-12 text-neon-alert z-50 fixed inset-0">
        <pre className="font-mono text-xl whitespace-pre-wrap typewriter-cursor">
          {typewriterText}
        </pre>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-8 transition-colors duration-300
        ${gameState === 'glitch' ? 'glitch-tear invert bg-white text-black' : 'bg-sci-bg-dark text-white'}
      `}
      ref={containerRef}
    >
      {/* Header */}
      <header className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 opacity-70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f3ff] animate-pulse"></span>
          <span className="text-xs tracking-[0.2em] text-neon-cyan">SYS_BRIDGE: VISUAL RECONSTRUCTION</span>
        </div>
        <div className="text-xs tracking-[0.2em] text-neon-alert">
          {gameState === 'glitch' ? 'INTEGRITY: CRITICAL FAILURE' : 'INTEGRITY: 62%'}
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className={`relative w-[600px] h-[450px] border border-[rgba(0,243,255,0.2)] rounded-lg overflow-hidden bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)]
        ${gameState === 'glitch' ? 'chromatic-aberration' : ''}
      `}>
        {/* Layer 1: Restored Memory (Bottom) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{ 
            backgroundImage: `url('${RESTORED_IMAGE}')`,
            opacity: gameState === 'victory' || gameState === 'glitch' ? 1 : 0 
          }}
        />

        {/* Layer 2: Corrupted Sky (Top, fades out) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{ 
            backgroundImage: `url('${CORRUPTED_IMAGE}')`,
            opacity: gameState === 'playing' ? 1 : 0 
          }}
        >
          {/* Steganography Subtractive Layer implementation
              We embed the green SUPERNOVA text that will be revealed when CMY lenses overlap.
              When Cyan (blocks R) and Yellow (blocks B) overlap, only Green passes.
              We'll render the text "SUPERNOVA" in green, and overlay it with red/blue noise.
          */}
          {gameState === 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* The Cipher Word */}
              <div 
                className="text-6xl font-orbitron font-bold tracking-[0.3em] opacity-80"
                style={{ color: 'rgb(0, 255, 0)' }}
              >
                SUPERNOVA
              </div>
              
              {/* Noise overlay to hide the green text from the naked eye */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-90 mix-blend-screen"
                style={{
                  background: 'repeating-linear-gradient(45deg, rgb(255,0,0) 0%, transparent 2%, rgb(0,0,255) 4%, transparent 6%)',
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
          )}
        </div>

        {/* Lenses Layer (Only in playing state) */}
        <AnimatePresence>
          {gameState === 'playing' && LENSES.map((lens) => (
            <motion.div
              key={lens.id}
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              initial={{ x: lens.defaultX, y: lens.defaultY, opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 w-28 h-28 border-[1.5px] border-white/20 rounded-md cursor-grab active:cursor-grabbing flex items-start justify-start p-1"
              style={{
                backgroundColor: lens.color,
                mixBlendMode: 'multiply',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-[10px] text-white/70 tracking-wider mix-blend-difference">{lens.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Victory Overlay Banner */}
        <AnimatePresence>
          {(gameState === 'victory' || gameState === 'glitch') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
            >
              <div className="bg-black/70 backdrop-blur-sm border border-neon-green px-8 py-4 rounded text-center">
                <h2 className="text-xl font-bold text-neon-green text-glow-green tracking-[0.2em] mb-2">
                  MEMORY RESTORED
                </h2>
                <p className="text-xs text-neon-green/70 tracking-widest">
                  VISUAL LAYERS VERIFIED
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Input Section */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 w-[600px] bg-[rgba(10,10,20,0.8)] border border-[rgba(0,243,255,0.15)] rounded p-6 backdrop-blur-md z-20"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-xs tracking-[0.15em] text-neon-cyan/70">
                &gt; INPUT DECRYPTED CIPHER
              </label>
              
              <div className="flex gap-4">
                <motion.div 
                  className="flex-grow"
                  animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => setShake(false)}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-black border border-neon-cyan/30 text-neon-cyan font-mono px-4 py-3 outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all uppercase tracking-widest"
                    placeholder="ENTER CIPHER..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </motion.div>
                
                <button 
                  type="submit"
                  className="bg-transparent border border-neon-cyan text-neon-cyan px-8 py-3 font-bold tracking-widest hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all cursor-pointer"
                >
                  SUBMIT
                </button>
              </div>

              <div className="h-4">
                {errorMsg && (
                  <span className="text-xs text-neon-alert text-glow-red tracking-widest">
                    [ERROR] {errorMsg}
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
