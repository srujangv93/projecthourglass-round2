'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Play, Database, History, Wifi, AlertTriangle } from "lucide-react";
import Terminal from "@/components/Terminal";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* 2007 Desktop Style Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar - System Info */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <Terminal title="SYSTEM_INFO">
            <div className="space-y-4 text-[11px] font-mono text-[#5D4037]">
              <div className="flex items-center gap-2">
                <Wifi size={12} className="text-[#2E7D32]" />
                <span>CONNECTION: WEAK</span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={12} className="text-[#3A6EA5]" />
                <span>DRIVE: [C:] 82% FULL</span>
              </div>
              <div className="h-px bg-[#D7CCC8] my-2" />
              <div className="text-[10px] text-[#8D6E63] italic">
                &quot;Finding what was lost in the noise of 2007...&quot;
              </div>
            </div>
          </Terminal>

          <div className="win-bevel p-3 bg-[#D7CCC8] space-y-2">
            <div className="text-[10px] font-bold text-[#5D4037] uppercase flex items-center gap-2">
              <History size={12} /> Recent Fragments
            </div>
            <div className="text-[9px] font-mono text-[#8D6E63] space-y-1">
              <div>&gt; _IMG_0422.JPG</div>
              <div>&gt; _CLIP_RE_02.MOV</div>
              <div>&gt; _TRACK_04.MP3</div>
            </div>
          </div>
        </div>


        {/* Main Content Area */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            {/* Vintage Site Header */}
            <div className="inline-block px-8 py-2 bg-[#D7CCC8] border-t-2 border-x-2 border-[#F5E6D3] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <h2 className="text-[#3A6EA5] text-[10px] font-black italic tracking-[0.2em] font-sans uppercase">
                Family Media Archive v1.0.4
              </h2>
            </div>
            
            <div className="win-bevel paper-texture p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              {/* Coffee Stain / Aging Effect */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#3E2723] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#D4A870] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

              {/* Fake Watermark */}
              <div className="absolute top-4 right-6 opacity-5 rotate-[15deg] pointer-events-none select-none font-black text-6xl text-[#3E2723] italic">
                2007
              </div>

              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="space-y-10 relative z-10"
              >
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#3E2723] drop-shadow-md font-sans italic leading-[0.9]">
                    The Echoes <br />
                    <span className="text-[#3A6EA5] not-italic">Of The Past</span>
                  </h1>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px bg-[#D7CCC8] flex-1" />
                    <p className="text-[10px] text-[#8D6E63] font-mono tracking-[0.3em] uppercase italic px-4">
                      Restoring Archive...
                    </p>
                    <div className="h-px bg-[#D7CCC8] flex-1" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-8">
                    <Link href="/join" className="w-full max-w-[280px]">
                      <button className="w-full py-5 bg-[#A67C52] text-[#F5E6D3] text-sm font-black rounded-xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Play size={18} fill="#F5E6D3" className="group-hover:scale-110 transition-transform" />
                        ACCESS ARCHIVE
                        <ChevronRight size={18} />
                      </button>
                    </Link>

                    {/* Progress Bar - Improved Old Style */}
                    <div className="w-full max-w-[240px] space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-[#8D6E63] font-bold">
                        <span className="animate-pulse">LOAD_EVENT_SYNC...</span>
                        <span>82%</span>
                      </div>
                      <div className="h-5 bg-[#D7CCC8] border-2 border-[#A1887F] p-0.5 overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)]">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "82%" }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#3A6EA5] to-[#5C7C99] shadow-[inset_0_4px_4px_rgba(255,255,255,0.3)] relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[scanline_2s_linear_infinite]" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Alerts/System */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <Terminal title="NOTIFICATIONS">
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-[11px] text-[#B71C1C] bg-[#EFEBE9] p-2 border border-[#D7CCC8]">
                <AlertTriangle size={14} className="shrink-0" />
                <span>WARNING: File &quot;MEMORY_001&quot; is corrupted. Calibration required.</span>
              </div>
              <div className="text-[10px] text-[#8D6E63] font-mono border-t border-[#D7CCC8] pt-2">
                &quot;Every echo has found its home.&quot;
              </div>
            </div>
          </Terminal>

          <div className="win-bevel bg-[#3A6EA5] p-4 text-[#F5E6D3]">
            <h4 className="text-[11px] font-bold mb-2 flex items-center gap-2">
              <History size={14} /> ARCHIVE_LOG
            </h4>
            <div className="text-[9px] font-mono opacity-80 space-y-1">
              <div>[14:22] SYNC_START</div>
              <div>[14:23] BUFFER_DATA</div>
              <div>[14:25] RETRIEVING...</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Taskbar Style Text */}
      <div className="fixed bottom-0 left-0 w-full bg-[#D7CCC8] border-t-2 border-[#F5E6D3] px-4 py-1 flex justify-between items-center z-[1001] hidden md:flex">
        <div className="flex items-center gap-4">
          <div className="bg-[#2E7D32] px-3 py-1 border-r-2 border-[#F5E6D3] text-[#F5E6D3] text-[11px] font-bold flex items-center gap-2 cursor-pointer hover:brightness-110">
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 bg-[#2E7D32]" />
            </div>
            START
          </div>
          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-widest font-sans">
            Rec_Archive.exe
          </div>
        </div>
        <div className="text-[10px] text-[#5D4037] font-bold font-mono bg-[#EFEBE9] px-4 py-1 border-l-2 border-[#A1887F]">
          SESSION: 2007_RESTORED
        </div>
      </div>
    </div>
  );
}
