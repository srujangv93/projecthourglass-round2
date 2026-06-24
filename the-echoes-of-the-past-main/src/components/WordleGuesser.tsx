'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Key, ChevronRight } from 'lucide-react';

interface WordleGuesserProps {
  onSuccess: () => void;
  collectedLetters: string[];
  jumbledLetters: string[];
}

export default function WordleGuesser({ onSuccess, collectedLetters, jumbledLetters }: WordleGuesserProps) {
  const [guess, setGuess] = useState(Array(9).fill(''));
  const [status, setStatus] = useState<{ type: 'none' | 'success' | 'error', message: string }>({ type: 'none', message: '' });
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newGuess = [...guess];
    newGuess[index] = value.toUpperCase();
    setGuess(newGuess);

    // Move to next input
    if (value && index < 8) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !guess[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalGuess = guess.join('');
    if (finalGuess.length < 9) return;

    setLoading(true);
    setStatus({ type: 'none', message: '' });

    try {
      const res = await fetch('/api/game/wordle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ guess: finalGuess }),
      });

      const data = await res.json();
      if (data.correct) {
        setStatus({ type: 'success', message: data.message });
        setTimeout(onSuccess, 2000);
      } else {
        setStatus({ type: 'error', message: data.message });
        setTimeout(() => setStatus({ type: 'none', message: '' }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Override connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="win-bevel paper-texture p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Encryption Overlay */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
        <div className="text-[40px] font-black font-mono leading-none">KEY_GEN_V2</div>
      </div>

      <div className="flex items-center gap-4 mb-10 border-b-2 border-[#D7CCC8] pb-6">
        <div className="p-3 bg-[#3A6EA5] rounded-xl shadow-xl border-2 border-[#F5E6D3]/20">
          <Key className="text-[#F5E6D3] animate-pulse" size={24} />
        </div>
        <div>
          <div className="text-2xl font-black font-sans text-[#3E2723] italic tracking-tighter uppercase">GUESS THE WORD</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="mb-12 bg-[#EFEBE9]/60 border-2 border-[#D7CCC8] p-8 shadow-inner relative overflow-hidden rounded-xl">
          <div className="absolute top-2 right-4 opacity-20 font-bold text-[8px] font-mono tracking-widest uppercase">Encryption_Pool_Active</div>
          <div className="text-[10px] text-[#3A6EA5] uppercase tracking-[0.3em] mb-6 font-black italic border-b border-[#D7CCC8]/50 pb-2 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8CFF8C] shadow-[0_0_8px_#8CFF8C]" /> Recovered_Fragments:
          </div>
          <div className="flex flex-wrap gap-4">
            {collectedLetters.map((l, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="w-12 h-14 border-2 border-[#3A6EA5] bg-[#3A6EA5]/10 flex items-center justify-center font-mono font-black rounded-lg text-2xl text-[#3A6EA5] shadow-[inset_0_2px_10px_rgba(58,110,165,0.1),0_4px_10px_rgba(0,0,0,0.1)]"
              >
                {l}
              </motion.div>
            ))}
            {collectedLetters.length === 0 && (
              <div className="text-[10px] font-mono text-[#8D6E63] italic uppercase tracking-widest py-2">No fragments recovered yet.</div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2 flex-wrap">
          {guess.map((char, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-10 h-16 md:w-16 md:h-20 bg-[#F5F1ED] border-2 border-[#A1887F] rounded-xl text-center text-2xl md:text-4xl font-mono font-black text-[#3E2723] focus:outline-none focus:border-[#3A6EA5] focus:bg-white transition-all uppercase shadow-[inset_2px_2px_8px_rgba(0,0,0,0.05)]"
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            type="submit"
            disabled={loading || guess.join('').length < 9}
            className="w-full max-w-md py-6 bg-[#A67C52] text-[#F5E6D3] uppercase tracking-[0.3em] font-black text-sm rounded-2xl shadow-2xl disabled:opacity-50 disabled:grayscale transition-all"
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? 'CALIBRATING_HASH...' : 'EXECUTE OVERRIDE'}
              {!loading && <ChevronRight size={18} />}
            </span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {status.type !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-10 p-6 border-2 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] shadow-2xl font-black rounded-xl ${
              status.type === 'success' 
                ? 'border-[#2E7D32] text-[#1B5E20] bg-[#E8F5E9]' 
                : 'border-[#B71C1C] text-[#C62828] bg-[#FFEBEE]'
            }`}
          >
            {status.type === 'success' ? <ShieldCheck size={24} className="shrink-0" /> : <ShieldAlert size={24} className="shrink-0" />}
            <span>{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
