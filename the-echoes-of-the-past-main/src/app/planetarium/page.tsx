'use client';

import { PlanetariumProvider, usePlanetarium } from "@/components/PlanetariumContext";
import Terminal from "@/components/Terminal";
import StageOne from "@/components/planetarium/StageOne";

function PlanetariumContent() {
  const { state } = usePlanetarium();
  
  return (
    <Terminal title={`PLANETARIUM_ARCHIVE_STAGE_${state.stage}`} className="w-full max-w-5xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="min-h-[60vh] p-6">
        {state.stage === 1 && <StageOne />}
        {state.stage === 2 && <div className="text-[#A67C52]">Stage 2: Spectral Filters</div>}
      </div>
    </Terminal>
  );
}

export default function PlanetariumPage() {
  return (
    <PlanetariumProvider>
      <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center">
        <PlanetariumContent />
      </div>
    </PlanetariumProvider>
  );
}
