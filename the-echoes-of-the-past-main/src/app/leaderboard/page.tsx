'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import { Trophy, Medal, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatTime = (ms: number) => {
    if (!ms || ms === Infinity) return '--:--';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) return <div className="p-10 text-primary font-mono text-center mt-20">SYNCING ARCHIVE DATA...</div>;

  return (
    <div className="relative min-h-screen p-6 md:p-10 flex flex-col items-center justify-center max-w-4xl mx-auto z-10">
      <div className="w-full text-center mb-12">
        <h1 className="text-4xl font-bold tracking-widest mb-2 flex items-center justify-center gap-4 text-archive-white drop-shadow-md">
          <Trophy className="text-archive-amber drop-shadow-[0_0_8px_rgba(200,155,99,0.5)]" size={32} />
          HALL OF ECHOES
        </h1>
        <p className="text-archive-amber/50 font-mono text-xs uppercase tracking-[0.3em]">Simulation Calibration Rankings</p>
      </div>

      <div className="w-full bg-archive-black/50 backdrop-blur-md rounded-[12px] p-6 border border-archive-amber/20 shadow-[0_0_50px_rgba(17,17,17,0.8)]">
        <div className="flex items-center gap-2 mb-6 border-b border-archive-amber/10 pb-4">
          <div className="w-2 h-2 rounded-full bg-archive-green animate-pulse" />
          <span className="text-[10px] font-bold text-archive-amber/50 uppercase tracking-[0.2em]">TOP_OPERATIVES</span>
        </div>
        
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="p-10 text-center text-archive-white/40 font-mono italic">No data fragments found. Mission in progress.</div>
          ) : (
            teams.map((team, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={team._id}
                className={`p-4 rounded-[8px] border flex items-center justify-between transition-all hover:bg-white/10 ${
                  idx === 0 ? 'border-archive-amber/50 bg-archive-amber/10 shadow-[0_0_15px_rgba(200,155,99,0.1)]' : 'border-white/5 bg-black/20'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold font-mono ${
                    idx === 0 ? 'text-archive-amber' : 'text-archive-white/40'
                  }`}>
                    {idx === 0 ? <Medal size={24} /> : (idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <div className="font-bold text-archive-white tracking-widest">{team.name}</div>
                  </div>
                </div>

                <div className="flex gap-8 text-right">
                  <div className="hidden md:block">
                    <div className="text-[8px] uppercase text-archive-amber/50 tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Target size={10} /> Progress
                    </div>
                    <div className="text-sm font-bold text-archive-white/80">
                      {team.currentPuzzleIndex} Nodes
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase text-archive-amber/50 tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Clock size={10} /> Sync Time
                    </div>
                    <div className={`text-sm font-bold font-mono ${team.isCompleted ? 'text-archive-green drop-shadow-[0_0_5px_rgba(124,255,124,0.3)]' : 'text-archive-white/60'}`}>
                      {team.isCompleted ? formatTime(new Date(team.endTime).getTime() - new Date(team.startTime).getTime()) : 'ACTIVE'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 text-center w-full">
        <button 
          onClick={() => window.location.href = '/welcome'}
          className="text-archive-white/40 hover:text-archive-white transition-all text-xs font-mono uppercase tracking-[0.3em]"
        >
          &gt; RETURN TO COMMAND CENTER
        </button>
      </div>
    </div>
  );
}
