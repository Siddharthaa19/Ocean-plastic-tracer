import React from 'react';
import { TimelineStep } from '../types';
import { DRIFT_TRAJECTORY_DATA } from '../data/mockData';
import { Play, Pause, Clock, Navigation } from 'lucide-react';

interface DriftTimelineProps {
  currentStep: TimelineStep;
  onSelectStep: (step: TimelineStep) => void;
}

export const DriftTimeline: React.FC<DriftTimelineProps> = ({ currentStep, onSelectStep }) => {
  const steps: TimelineStep[] = ['NOW', '12H', '24H', '48H', '72H'];
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        onSelectStep(steps[(steps.indexOf(currentStep) + 1) % steps.length]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, onSelectStep]);

  const activeData = DRIFT_TRAJECTORY_DATA[currentStep];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-3.5 shadow-lg select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play button & Label */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-xl bg-[#0878D1] hover:bg-[#0766B3] text-white flex items-center justify-center shadow-md shadow-[#0878D1]/30 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0878D1]" />
              <span className="text-xs font-black text-[#071A33] tracking-wide">
                DRIFT TIMELINE FORECAST
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              Lagrangian Drift Model · CMEMS Ocean Currents + GFS Wind
            </div>
          </div>
        </div>

        {/* Center: Timeline Step Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          {steps.map((step) => {
            const isActive = currentStep === step;
            return (
              <button
                key={step}
                onClick={() => {
                  setIsPlaying(false);
                  onSelectStep(step);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0878D1] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {step}
              </button>
            );
          })}
        </div>

        {/* Right: Active step metrics summary */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold pl-3 border-l border-slate-200 text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Displacement</span>
            <span className="font-extrabold text-[#0878D1]">{activeData.displacementKm} km</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current</span>
            <span className="font-extrabold text-slate-800">{activeData.currentSpeedKnots} kn</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Uncertainty</span>
            <span className="font-extrabold text-[#18B77A]">±{activeData.uncertaintyRadiusKm} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
