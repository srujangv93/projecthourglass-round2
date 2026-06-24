'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Terminal from "@/components/Terminal";
import { motion } from "framer-motion";
import { UserPlus, Fingerprint, Shield, ChevronRight } from "lucide-react";

export default function JoinPage() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Team joined successfully, data:", data);
        localStorage.setItem("teamToken", data.token);
        localStorage.setItem("teamId", data.teamId);
        console.log("Navigating to /play");
        router.push("/play");
      } else {
        setError(data.error || "Failed to register team");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Content - Aged Window Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg win-bevel paper-texture p-8 md:p-12 shadow-2xl flex flex-col"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-black tracking-tighter text-center uppercase text-[#3E2723] drop-shadow-sm font-sans italic">Initialize Squad</h2>
          <div className="w-full max-w-xs h-0.5 bg-gradient-to-r from-transparent via-[#A1887F] to-transparent mt-4" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col w-full">
          <div className="relative flex flex-col gap-2">
            <label className="text-[10px] text-[#3A6EA5] uppercase tracking-[0.2em] font-black ml-1 italic">Squad Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-[#EFEBE9] border-2 border-[#D7CCC8] rounded px-5 py-4 text-[#3E2723] placeholder:text-[#A1887F]/30 focus:outline-none focus:border-[#3A6EA5] focus:bg-white transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] font-sans italic font-bold"
              placeholder="Enter Squad Name..."
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-[#FFEBEE] border-l-4 border-[#B71C1C] text-[#C62828] text-[10px] font-mono font-bold uppercase tracking-widest shadow-md"
            >
              [AUTH_NOTICE]: {error}
            </motion.div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#A67C52] text-[#F5E6D3] uppercase tracking-[0.3em] font-black rounded-xl transition-all duration-300 disabled:opacity-50 shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "SYNCHRONIZING..." : "ESTABLISH LINK"}
                {!loading && <ChevronRight size={18} />}
              </span>
            </button>
          </div>
        </form>


        {/* Secure connection text removed per user request */}
      </motion.div>
      
      {/* Archive status removed per user request */}
    </div>
  );
}
