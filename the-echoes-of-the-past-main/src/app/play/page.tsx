'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '@/components/Terminal';
import WordleGuesser from '@/components/WordleGuesser';
import AudioPlayer from '@/components/AudioPlayer';
import { CheckCircle, XCircle, Key, Headphones, Database, ChevronRight } from 'lucide-react';

export default function PlayPage() {
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [activePuzzle, setActivePuzzle] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [noPuzzles, setNoPuzzles] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' });
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [showWordle, setShowWordle] = useState(false);
  const [teamName, setTeamName] = useState('');
  const router = useRouter();

  const fetchPuzzles = async () => {
    try {
      const res = await fetch('/api/game/puzzle', { 
        credentials: 'include' 
      });
      const data = await res.json();

      if (res.ok) {
        if (data.noPuzzles) {
          setNoPuzzles(true);
        } else {
          setPuzzles(data.puzzles || []);
          setCollectedLetters(data.collectedLetters || []);
          setAttempts(data.attempts || 0);
          setTeamName(data.teamName || '');
        }
      } else {
        router.push('/join');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("PlayPage loaded. Puzzles:", puzzles, "ActivePuzzle:", activePuzzle, "NoPuzzles:", noPuzzles);
    fetchPuzzles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || submitting || !activePuzzle) return;

    setSubmitting(true);
    setStatus({ type: 'none', message: '' });

    try {
      const res = await fetch('/api/game/validate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ puzzleId: activePuzzle._id, answer }),
      });

      const data = await res.json();

      if (data.correct) {
        setStatus({ type: 'success', message: 'Verification successful. Memory restored.' });
        setAnswer('');
        if (data.letter && !collectedLetters.includes(data.letter)) {
          setCollectedLetters(prev => [...prev, data.letter]);
        }
        setTimeout(() => {
          setStatus({ type: 'none', message: '' });
          setActivePuzzle(null);
          fetchPuzzles();
          if (data.isCompleted) {
            setShowWordle(true);
          }
        }, 2000);
      } else {
        setStatus({ type: 'error', message: 'Identification failed. Try again.' });
        setAttempts(data.attempts);
        setTimeout(() => setStatus({ type: 'none', message: '' }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection lost. Retrying...' });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono tracking-widest uppercase italic animate-pulse">
          Searching Archives...
        </div>
      </div>
    );
  }

  if (noPuzzles) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Terminal title="ARCHIVE_EMPTY" className="max-w-md paper-texture">
          <div className="text-center py-6">
            <h2 className="text-xl font-bold mb-4 font-serif uppercase tracking-widest">No Records Found</h2>
            <p className="text-sm opacity-70 font-mono mb-8 italic">
              Please contact the archivist to add audio fragments to the collection.
            </p>
            <button
              onClick={() => router.push('/join')}
              className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-md"
            >
              Return Home
            </button>
          </div>
        </Terminal>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Screen - 2007 Software Style */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Mode Switcher - Folder Tabs Style */}
        <div className="flex gap-1 ml-2">
          <button 
            onClick={() => setShowWordle(false)}
            className={`px-8 py-2 rounded-t-xl transition-all font-black text-[10px] uppercase tracking-widest border-t-2 border-x-2 folder-tab ${
              !showWordle 
                ? 'bg-[#EFEBE9] border-[#F5E6D3] text-[#3A6EA5] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20' 
                : 'bg-[#D7CCC8] border-[#A1887F] text-[#8D6E63] hover:text-[#5D4037] mt-1 opacity-80 z-10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Headphones size={14} strokeWidth={3} /> AUDIO_ANALYSIS
            </div>
          </button>
          <button 
            onClick={() => setShowWordle(true)}
            className={`px-8 py-2 rounded-t-xl transition-all font-black text-[10px] uppercase tracking-widest border-t-2 border-x-2 folder-tab ${
              showWordle 
                ? 'bg-[#EFEBE9] border-[#F5E6D3] text-[#3A6EA5] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20' 
                : 'bg-[#D7CCC8] border-[#A1887F] text-[#8D6E63] hover:text-[#5D4037] mt-1 opacity-80 z-10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key size={14} strokeWidth={3} /> GUESS THE WORD
            </div>
          </button>
        </div>

        <motion.div
          key={showWordle ? 'wordle' : 'audio'}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {!showWordle ? (
            <div className="win-bevel paper-texture p-6 md:p-10 shadow-2xl">
              {puzzles.length > 0 && puzzles.every(p => p.isSolved) ? (
                <div className="text-center py-12 space-y-8 bg-[#EFEBE9]/50 border-2 border-dashed border-[#D7CCC8] p-8 shadow-inner">
                  <div className="flex justify-center">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="p-6 rounded-full bg-[#E8F5E9] border-4 border-[#2E7D32] shadow-xl"
                    >
                      <CheckCircle className="text-[#2E7D32]" size={56} />
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black text-[#3E2723] uppercase tracking-tighter italic">Archive Recovered</h2>
                    <p className="text-[#8D6E63] font-mono text-[11px] uppercase tracking-[0.3em] bg-white/40 py-3 border-y border-[#D7CCC8] font-bold">
                      [STATUS]: Calibration Complete. Signal Stabilized.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowWordle(true)}
                    className="w-full px-16 py-5 bg-[#A67C52] text-[#F5E6D3] font-black uppercase tracking-[0.3em] text-xs rounded-xl shadow-xl"
                  >
                    INITIATE MASTER OVERRIDE
                  </button>
                </div>
              ) : (
                <>
                  {/* System Header */}
                  {activePuzzle ? (
                    <>
                      <div className="flex justify-between items-center mb-8 border-b-2 border-[#D7CCC8] pb-6">
                        <button onClick={() => setActivePuzzle(null)} className="text-[10px] font-black text-[#8D6E63] hover:text-[#3A6EA5] uppercase tracking-[0.2em] italic">
                          &lt; BACK TO ARCHIVE
                        </button>
                        <div className="flex items-center gap-5">
                          <div>
                            <div className="text-2xl font-black font-sans text-[#3E2723] italic tracking-tight">
                              {activePuzzle.name}
                            </div>
                            <div className="text-xs font-mono text-[#5D4037] mt-2">
                              {activePuzzle.hint1}
                            </div>
                          </div>
                        </div>
                        <div className="text-right hidden md:block opacity-60">
                        </div>
                      </div>

                      {/* Audio Player */}
                      {activePuzzle.audioUrl && (
                        <div className="mb-8">
                          <AudioPlayer src={activePuzzle.audioUrl} />
                        </div>
                      )}

                      {/* Core Interaction */}
                      <div className="space-y-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                          <div className="relative bg-[#EFEBE9]/60 p-8 border-2 border-[#D7CCC8] shadow-inner rounded-xl">
                            <input
                              type="text"
                              autoFocus
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              disabled={submitting || status.type === 'success'}
                              className="w-full bg-[#F5F1ED] border-2 border-[#A1887F] p-5 text-3xl text-[#3E2723] focus:outline-none focus:border-[#3A6EA5] focus:bg-white transition-all font-mono font-bold placeholder:text-[#D7CCC8]/50 shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)] rounded-lg"
                            />
                            
                            <AnimatePresence>
                              {status.type !== 'none' && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  className={`mt-8 p-5 border-2 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] shadow-xl font-bold ${
                                    status.type === 'success' 
                                      ? 'border-[#2E7D32] text-[#1B5E20] bg-[#E8F5E9]' 
                                      : 'border-[#B71C1C] text-[#C62828] bg-[#FFEBEE]'
                                  }`}
                                >
                                  {status.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                  <span>
                                    {status.message}
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex justify-center pt-2">
                            <button
                              type="submit"
                              disabled={submitting || !answer.trim() || status.type === 'success'}
                              className="w-full max-w-sm py-6 bg-[#A67C52] text-[#F5E6D3] uppercase tracking-[0.4em] font-black rounded-2xl text-sm disabled:opacity-50 disabled:grayscale transition-all shadow-2xl"
                            >
                              {submitting ? "PROCESSING_DATA..." : "RESTORE SEGMENT"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {puzzles.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => setActivePuzzle(p)}
                          disabled={p.isSolved}
                          className={`p-6 border-2 rounded-xl transition-all ${
                            p.isSolved 
                              ? 'bg-[#D7CCC8] border-[#A1887F] opacity-50 cursor-not-allowed'
                              : 'bg-[#F5F1ED] border-[#D7CCC8] hover:border-[#3A6EA5] hover:bg-white'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[#8D6E63] mb-2">
                            {p.isSolved ? 'RECOVERED' : 'LOCKED'}
                          </div>
                          <div className="text-xl font-black text-[#3E2723] italic">
                            {p.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <WordleGuesser 
              collectedLetters={collectedLetters} 
              jumbledLetters={[]} 
              onSuccess={() => router.push('/success')} 
            />
          )}
        </motion.div>
      </div>
      
      <div className="mt-16 mb-20 text-[10px] text-[#8D6E63] font-black font-mono flex flex-wrap justify-center gap-10 md:gap-20 uppercase tracking-[0.3em] relative z-10 bg-white/40 px-10 py-3 rounded-full backdrop-blur-md border-2 border-[#D7CCC8] shadow-xl italic">
        {teamName && <span>Squad: {teamName}</span>}
        <span>Calibration: {collectedLetters.length} / {puzzles.length} Fragments</span>
        <span>Attempts: {attempts}</span>
      </div>
    </div>
  );
}
