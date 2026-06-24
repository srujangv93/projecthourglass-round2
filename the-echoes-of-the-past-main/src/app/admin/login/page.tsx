'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Terminal from '@/components/Terminal';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 rounded-[12px] bg-archive-black/50 backdrop-blur-md border border-red-500/20 shadow-[0_0_50px_rgba(17,17,17,0.8)] flex flex-col items-center"
      >
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="p-4 rounded-full bg-red-900/10 border border-red-500/30 mb-4 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <Lock size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-widest text-center uppercase text-red-400 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">Admin Override</h2>
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-4 mb-2" />
          <p className="text-[10px] text-red-400/40 font-mono">SECURE SHELL v4.2 // ENCRYPTION: AES-256</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="relative flex flex-col gap-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] ml-1 text-red-400/60">Encryption Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[12px] px-5 py-4 text-archive-white placeholder:text-archive-white/30 focus:outline-none focus:border-red-500/60 focus:bg-white/10 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 backdrop-blur-sm font-mono tracking-[0.3em]"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-900/20 border-l-4 border-red-500 text-red-400 text-xs font-mono italic"
            >
              [AUTH_FAILURE]: {error}
            </motion.div>
          )}

          <div className="pt-4 group">
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-5 bg-red-900/10 border border-red-500/50 text-red-400 uppercase tracking-[0.3em] font-bold rounded-[12px] overflow-hidden transition-all duration-300 hover:text-white hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none"
            >
              <span className="relative z-10">{loading ? "AUTHENTICATING..." : "GRANT ACCESS"}</span>
              {!loading && <div className="absolute inset-0 bg-red-600 w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
