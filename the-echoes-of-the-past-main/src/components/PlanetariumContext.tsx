'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type GameState = {
  stage: number;
  riddlesSolved: boolean[];
  activeFilter: string | null;
  collectedFragments: string[];
  password: string | null;
};

const PlanetariumContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
} | null>(null);

export function PlanetariumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    stage: 1,
    riddlesSolved: Array(10).fill(false),
    activeFilter: null,
    collectedFragments: [],
    password: null,
  });

  return (
    <PlanetariumContext.Provider value={{ state, setState }}>
      {children}
    </PlanetariumContext.Provider>
  );
}

export const usePlanetarium = () => {
  const context = useContext(PlanetariumContext);
  if (!context) throw new Error('usePlanetarium must be used within PlanetariumProvider');
  return context;
};
