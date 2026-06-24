'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Terminal from '@/components/Terminal';
import { ShieldCheck, Trophy, Clock, History, ScrollText } from 'lucide-react';

export default function SuccessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/game/complete', {
          credentials: 'include'
        });
        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to retrieve archive data');
          setTimeout(() => router.push('/join'), 2000);
        }
      } catch (err) {
        console.error(err);
        setError('Communication failure with central archive.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatTime = (seconds: number) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-mono tracking-widest uppercase italic"
        >
          &gt; Verifying restoration...
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Terminal title="ACCESS_RESTRICTED" className="max-w-md border-error paper-texture">
          <div className="text-error font-mono text-center p-6">
            <ScrollText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4 font-bold italic underline">Notice: {error || 'Archive incomplete'}</p>
            <p className="text-[10px] opacity-70 uppercase tracking-widest">Returning to active session...</p>
          </div>
        </Terminal>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Content - 2007 Report Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl win-bevel bg-[#EFEBE9] p-8 md:p-12 shadow-2xl flex flex-col text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 flex justify-center"
        >
          <div className="p-5 rounded-full bg-[#E8F5E9] border-4 border-[#2E7D32] shadow-xl">
            <ShieldCheck size={56} className="text-[#2E7D32]" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-black mb-12 uppercase tracking-tighter text-[#3E2723] font-sans italic"
        >
          MEMORY RESTORED SUCCESSFULLY, NOW MOVING ON TO THE NEXT MEMORY
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button
            onClick={() => router.push('/join')}
            className="text-[#8D6E63] hover:text-[#3A6EA5] transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            [ Exit Archives ]
          </button>
        </motion.div>
      </motion.div>
      
      <div className="mt-8 text-[9px] font-mono text-[#8D6E63] uppercase tracking-widest">
        Session_End: {new Date().toLocaleTimeString()} | Client: WIN_XP_RESTORE_TOOL
      </div>
    </div>
  );
}
