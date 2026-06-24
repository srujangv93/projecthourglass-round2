'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlanetarium } from '@/components/PlanetariumContext';

const CELESTIAL_OBJECTS = [
  { id: 'sun', name: 'Sun' },
  { id: 'moon', name: 'Moon' },
  { id: 'earth', name: 'Earth' },
  { id: 'mars', name: 'Mars' },
];

const RIDDLES = [
  { riddle: "I shine without burning and guide travelers through the night.", answer: 'sun' },
  { riddle: "I am a silent witness that changes shape but not in size.", answer: 'moon' },
];

export default function StageOne() {
  const { state, setState } = usePlanetarium();
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');

  const handleObjectClick = (objectId: string) => {
    if (objectId === RIDDLES[currentRiddleIndex].answer) {
      setFeedback('success');
      setTimeout(() => {
        setFeedback('none');
        if (currentRiddleIndex < RIDDLES.length - 1) {
          setCurrentRiddleIndex(prev => prev + 1);
        } else {
          // All riddles solved for this stage
          setState(prev => ({ ...prev, stage: 2 }));
        }
      }, 1000);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('none'), 1000);
    }
  };

  return (
    <div className="space-y-8">
      <div className={`p-6 border-2 rounded-lg transition-colors ${
        feedback === 'success' ? 'bg-green-900/20 border-green-500' :
        feedback === 'error' ? 'bg-red-900/20 border-red-500' :
        'bg-[#1A1A1A] border-[#5D4037]'
      }`}>
        <p className="text-[#A67C52] font-mono text-lg tracking-widest italic">
          &gt; {RIDDLES[currentRiddleIndex].riddle}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CELESTIAL_OBJECTS.map(obj => (
          <motion.button
            key={obj.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-32 bg-[#3E2723] rounded-lg flex items-center justify-center text-[#F5E6D3] uppercase font-bold tracking-widest border border-[#5D4037]"
            onClick={() => handleObjectClick(obj.id)}
          >
            {obj.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
