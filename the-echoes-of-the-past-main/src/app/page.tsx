'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="z-50"
      >
        <Link href="/ProjectRewind.html">
          <button className="px-8 py-4 bg-[#3A6EA5] text-[#F5E6D3] text-xl font-black rounded-xl border-4 border-[#F5E6D3] shadow-[0_0_20px_rgba(58,110,165,0.6)] hover:scale-105 hover:bg-[#4A7EB5] hover:shadow-[0_0_30px_rgba(58,110,165,0.8)] active:scale-95 transition-all tracking-wider uppercase">
            Enter Round 1
          </button>
        </Link>
      </motion.div>

      {/* 
        TV touch point area (kept for backward compatibility with the background image)
      */}
      <Link href="/welcome" className="absolute inset-0 z-40">
        <motion.div 
          className="w-full h-full cursor-pointer transition-all"
          whileTap={{ scale: 0.98 }}
          title="Enter Archive"
          style={{
            position: 'absolute',
            top: '40%',    
            left: '24.5%', 
            width: '16.5%',
            height: '24.5%'
          }}
        />
      </Link>
    </div>
  );
}
