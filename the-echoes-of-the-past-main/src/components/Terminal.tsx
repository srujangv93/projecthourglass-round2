'use client';

import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Terminal({ title, children, className = '' }: TerminalProps) {
  return (
    <div className={`win-bevel shadow-2xl overflow-hidden group ${className}`}>
      {/* Windows XP Style Title Bar - Muted/Aged */}
      <div className="bg-gradient-to-r from-[#3A6EA5] via-[#5C7C99] to-[#3A6EA5] px-2 py-1 flex items-center justify-between border-b border-[#2C4F74] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
        <div className="flex items-center gap-2">
          {/* Small folder-like icon placeholder */}
          <div className="w-4 h-4 bg-[#D4A870] rounded-sm border border-[#3E2723] shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 border-t border-l border-[#3E2723] opacity-50" />
          </div>
          <span className="text-[10px] font-bold text-[#F5E6D3] shadow-sm tracking-wide font-sans opacity-90 uppercase italic">
            {title}
          </span>
        </div>
        
        <div className="flex gap-1 py-0.5">
          <button className="w-4 h-4 bg-[#3A6EA5] border border-[#F5E6D3]/20 flex items-center justify-center rounded-sm hover:brightness-110 transition-colors shadow-inner">
            <Minus size={10} className="text-[#F5E6D3]" strokeWidth={4} />
          </button>
          <button className="w-4 h-4 bg-[#3A6EA5] border border-[#F5E6D3]/20 flex items-center justify-center rounded-sm hover:brightness-110 transition-colors shadow-inner">
            <Square size={8} className="text-[#F5E6D3]" strokeWidth={4} />
          </button>
          <button className="w-4 h-4 bg-[#C62828] border border-[#F5E6D3]/20 flex items-center justify-center rounded-sm hover:brightness-125 transition-colors shadow-inner">
            <X size={10} className="text-[#F5E6D3]" strokeWidth={4} />
          </button>
        </div>
      </div>
      
      {/* Content Area - Warm Aged Look with subtle texture */}
      <div className="p-4 bg-[#EFEBE9] text-[#3E2723] font-mono relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.03] pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
